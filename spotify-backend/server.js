const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// This function generates a random string of a given length to create a code verifier.
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
//************************* */
// Define Routes
//************************* */
// Login Route
//************************************************* */
app.get('/api/login', (req, res) => {
  console.log('Login route hit');
  const state = generateRandomString(16);
  res.cookie('spotify_auth_state', state);
  const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private';
  const redirectUrl = 'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state
    });
  console.log('Redirecting to:', redirectUrl);
  res.redirect(redirectUrl);
});

// Logout Route
//************************************************* */
app.post('/api/logout', (req, res) => {
  res.clearCookie('spotify_access_token');
  // Clear any server-side stored data (e.g., in a database)
  res.json({ success: true, message: 'Logged out successfully' });
});

// Function to refresh access token
// This function will be used internally and by the /api/refresh-token endpoint
//***************************************************************************** */
async function refreshAccessToken(req, res) {
  const refresh_token = req.cookies['spotify_refresh_token'];

  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      }), {
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, expires_in } = response.data;

    // Set the new access token as a HttpOnly cookie
    res.cookie('spotify_access_token', access_token, { httpOnly: true, maxAge: expires_in * 1000 });

    return access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

// Callback Route
//************************************************* */
app.get('/api/callback', async (req, res) => {
  const { code } = req.query;
  
  try {
    console.log('Received Code:', code);
    const spotifyApi = new SpotifyWebApi({
      redirectUri: REDIRECT_URI,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    });

    console.log('Attempting to exchange code for tokens...');
    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log('Tokens exchanged successfully:', data.body);

    const { access_token, refresh_token, expires_in } = data.body;

    // Set cookies
    res.cookie('spotify_access_token', access_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: expires_in * 1000,
      sameSite: 'lax' 
    });
    res.cookie('spotify_refresh_token', refresh_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' 
    });

    console.log('Cookies set, sending success response to frontend...');
    res.json({ success: true, message: 'Logged in successfully' }); 
  } catch (error) { 
    console.error('Error in /api/callback:', error);
    if (error.response && error.response.data.error === 'invalid_grant') {
      // If the code has already been used, just return success to the frontend
      // This prevents errors on page refreshes when the user is already logged in
      res.json({ success: true, message: 'Already Logged In' });
    } else {
      res.status(500).json({ 
        error: 'Internal Server Error', 
        details: error.message,
        body: error.body // Error body provides more details  
      }); 
    }
  }
});

// Check Auth Route
//************************************************* */ 
app.get('/api/check-auth', (req, res) => {
  const accessToken = req.cookies['spotify_access_token'];
  const refreshToken = req.cookies['spotify_refresh_token'];
  console.log('Checking auth status. Access token:', !!accessToken, 'Refresh token:', !!refreshToken);
  if (accessToken) {
    res.json({ isAuthenticated: true, accessToken, refreshToken });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Search Auth Route
//************************************************* */ 
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  const accessToken = req.cookies['spotify_access_token'];

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token' });
  }

  try {
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=40`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in /api/search:', error);
    if (error.response && error.response.status === 401) {
      // Token expired, try to refresh
      try {
        await refreshAccessToken(req, res);
        // Retry the search after refreshing
        return res.status(307).json({ message: 'Token refreshed, please retry the operation' });
      } catch (refreshError) {
        return res.status(401).json({ error: 'Failed to refresh token, please log in again' });
      }
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
}); 

// Refresh Access Token Route
//************************************************* */
app.post('/api/refresh-token', async (req, res) => {
  try {
    await refreshAccessToken(req, res);
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ error: 'Failed to refresh access token' });
  }
});

// Create-playlist Route (handles token expiration)
//************************************************* */
app.post('/api/create-playlist', async (req, res) => {
  const { name, description, isPublic, tracks } = req.body;
  const accessToken = req.cookies['spotify_access_token'];

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token available' });
  }

  try {
    // Use accesToken to make requests to Spotify API
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    const userId = userResponse.data.id;

    const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      name,
      description,
      public: isPublic
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    const playlistId = playlistResponse.data.id;

    await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      uris: tracks
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    res.json({ success: true, message: 'Playlist created successfully' });
  } catch (error) {
    console.error('Error creating playlist:', error);

    if (error.response && error.response.status === 401) {
      // Access token may be expired, try to refresh it
      try {
        await refreshAccessToken(req, res);
        // If refresh successful, ask client to retry the create-playlist operation
        return res.status(307).json({ message: 'Access token refreshed, please retry playlist creation' });
      } catch (refreshError) {
        console.error('Error refreshing access token:', refreshError);
        return res.status(401).json({ error: 'Failed to refresh access token, please login again' });
      }
    }
    // For all other errors, return a 500 status
    console.error('Error creating playlist:', error);
    res.status(500).json({ success: false, message: 'Failed to create playlist', error: error.message });
    }
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));