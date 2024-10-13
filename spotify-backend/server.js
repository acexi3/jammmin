const express = require('express');
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
      state: state,
      show_dialog: true
    });
  console.log('Redirecting to:', redirectUrl);
  res.redirect(redirectUrl);
});

app.get('/api/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    res.cookie('spotify_access_token', access_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expires_in * 1000
    });

    res.cookie('spotify_refresh_token', refresh_token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
    console.log('Access Token:', access_token, 'Refresh Token:', refresh_token);
    
    res.json({ success: true, message: 'Authentication successful' });
  } catch (error) {
    console.error('Error in /api/callback:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.get('/api/check-auth', (req, res) => {
  const accessToken = req.cookies['spotify_access_token'];
  const refreshToken = req.cookies['spotify_refresh_token'];
  res.json({ isAuthenticated: !!(accessToken && refreshToken) });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('spotify_access_token');
  res.clearCookie('spotify_refresh_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

const refreshAccessToken = async (req, res, next) => {
  const accessToken = req.cookies['spotify_access_token'];
  const refreshToken = req.cookies['spotify_refresh_token'];

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token available' });
  }

  if (accessToken) {
    return next();
  }

  try {
    spotifyApi.setRefreshToken(refreshToken);
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
    res.status(401).json({ error: 'Failed to refresh access token' });
  }
};

app.use('/api', refreshAccessToken);

app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  try {
    const data = await spotifyApi.searchTracks(q);
    res.json(data.body);
  } catch (error) {
    console.error('Error in /api/search:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/create-playlist', async (req, res) => {
  const { name, description, isPublic, tracks } = req.body;

  try {
    console.log('Creating playlist:', { name, description, isPublic, tracksCount: tracks.length });
    
    const accessToken = req.cookies['spotify_access_token'];
    if (!accessToken) {
      return res.status(401).json({ success: false, message: 'No access token found' });
    }
    spotifyApi.setAccessToken(accessToken);

    const me = await spotifyApi.getMe().then(data => data.body);
    console.log('User profile:', me);
    const userId = me.id;

    const playlist = await spotifyApi.createPlaylist(userId, name, { public: isPublic, description }).then(data => data.body);
    console.log('Playlist created:', playlist);

    const addTracksResult = await spotifyApi.addTracksToPlaylist(playlist.id, tracks).then(data => data.body);
    console.log('Tracks added to playlist:', addTracksResult);

    res.json({ success: true, message: 'Playlist created successfully' });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ success: false, message: 'Failed to create playlist', error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
