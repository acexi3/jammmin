const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

exports.handler = async (event, context) => {
  console.log('Callback function triggered');
  console.log('Environment variables check:', {
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    redirectUri: REDIRECT_URI
  });
  console.log('Query parameters:', event.queryStringParameters);

  const { code } = event.queryStringParameters;

  if (!code) {
    console.log('No code provided');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Authorization code is missing' })
    };
  }

  const spotifyApi = new SpotifyWebApi({
    redirectUri: REDIRECT_URI,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  });

  try {
    console.log('Attempting to exchange code for tokens');
    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log('Token exchange successful');
    
    const { access_token, refresh_token, expires_in } = data.body;

    // Create cookie strings with Max-Age
    const accessTokenCookie = `spotify_access_token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${expires_in}`;
    const refreshTokenCookie = `spotify_refresh_token=${refresh_token}; Path=/; HttpOnly; Secure; SameSite=Lax`;

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': accessTokenCookie + ', ' + refreshTokenCookie,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': 'https://findyournextjam.netlify.app'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Authentication successful'
      })
    };
  } catch (error) {
    console.error('Error in callback:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error', 
        details: error.message,
        stack: error.stack
      })
    };
  }
};