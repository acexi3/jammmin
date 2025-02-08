const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const spotifyApi = new SpotifyWebApi({
  redirectUri: REDIRECT_URI,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET
});

exports.handler = async (event, context) => {
  console.log('Search function triggered');
  console.log('Cookies received:', event.headers.cookie);
  
  const { q } = event.queryStringParameters;
  const cookies = event.headers.cookie?.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});

  console.log('Parsed cookies:', {
    hasAccessToken: !!cookies?.spotify_access_token,
    hasRefreshToken: !!cookies?.spotify_refresh_token
  });

  const accessToken = cookies?.spotify_access_token;

  if (!accessToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'No access token found' })
    };
  }

  spotifyApi.setAccessToken(accessToken);

  try {
    const data = await spotifyApi.searchTracks(q);
    return {
      statusCode: 200,
      body: JSON.stringify(data.body)
    };
  } catch (error) {
    console.error('Error in search:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        details: error.message 
      })
    };
  }
};