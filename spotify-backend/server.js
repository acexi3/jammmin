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

const spotifyApi = new SpotifyWebApi({
  redirectUri: REDIRECT_URI,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET
});

// This function generates a random string of a given length to create a code verifier.
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
 
// Route: Login
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

// Route: Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('spotify_access_token');
  // Clear any server-side stored data (e.g., in a database)
  res.json({ success: true, message: 'Logged out successfully' });
});

// Middleware to refresh the access token
const refreshAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies['spotify_refresh_token'];
  if (!refreshToken) {
    return next();
  }

  try {
    const data = await spotifyApi.refreshAccessToken();
    const { access_token, expires_in } = data.body;

    res.cookie('spotify_access_token', access_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expires_in * 1000
    });

    spotifyApi.setAccessToken(access_token);
    next();
  } catch (error) {
    console.error('Error refreshing access token:', error);
    next();
  }
};

// Apply the refresh middleware to all /api routes
app.use('/api', refreshAccessToken);

// Route: Callback
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
      sameSite: 'strict' 
    });
    res.cookie('spotify_refresh_token', refresh_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' 
    });

    console.log('Cookies set, sending success response...');
    res.json({ success: true, message: 'Logged in successfully' }); 
  
  } catch (error) { 
    console.error('Error in /api/callback:', error);
  
    if (error.body && error.body.error === 'invalid_grant') {
      // If the code has already been used, check if the user is already authenticated
      const accessToken = req.cookies['spotify_access_token'];
      const refreshToken = req.cookies['spotify_refresh_token']; 
      if (accessToken && refreshToken) {
        res.json({ success: true, message: 'Already Logged In' });
      } else {
        res.status(401).json({ error: 'Authentication failed', details: 'Please try logging in again' });
      }
    } else {
      res.status(500).json({ error: 'Internal Server Error', details: error.message }); 
    }
  }
});

// Route: Check Authentication Status
app.get('/api/check-auth', (req, res) => {
  const accessToken = req.cookies['spotify_access_token'];
  const refreshToken = req.cookies['spotify_refresh_token'];
  console.log('Checking auth status. Access token:', !!accessToken, 'Refresh token:', !!refreshToken);
  res.json({ 
    isAuthenticated: !!(accessToken && refreshToken),
    accessToken: accessToken,
    refreshToken: refreshToken
  });
});

// Route: Search  
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  const accessToken = req.cookies['spotify_access_token'];

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: { q, type: 'track' },
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in /api/search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route: Refresh Access Token
app.post('/api/refresh-token', async (req, res) => {
  try {
    await refreshAccessToken(req, res);
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ error: 'Failed to refresh access token' });
  }
});

// Route: Create-playlist (handles token expiration)
app.post('/api/create-playlist', async (req, res) => {
  const { name, description, isPublic, tracks } = req.body;
  const accessToken = req.cookies['spotify_access_token'];

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token available' });
  }

  try {
    const meResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const userId = meResponse.data.id;

    const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      name,
      description,
      public: isPublic
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    await axios.post(`https://api.spotify.com/v1/playlists/${playlistResponse.data.id}/tracks`, {
      uris: tracks
    }, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    res.json({ success: true, message: 'Playlist created successfully' });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ success: false, message: 'Failed to create playlist', error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
