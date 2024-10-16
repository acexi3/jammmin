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
  const { code } = event.queryStringParameters;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code is missing' })
    };
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token, expires_in } = data.body;

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': [
          `spotify_access_token=${access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${expires_in}`,
          `spotify_refresh_token=${refresh_token}; HttpOnly; Secure; SameSite=Strict`
        ]
      },
      body: JSON.stringify({ success: true, message: 'Authentication successful' })
    };
  } catch (error) {
    console.error('Error in callback:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
    };
  }
};