const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

exports.handler = async (event, context) => {
  // Add debugging
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

    // Set cookies with appropriate domain
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',  // Changed from 'Strict' to 'Lax'
      path: '/',
      maxAge: expires_in * 1000
    };

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': [
          `spotify_access_token=${access_token}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`,
          `spotify_refresh_token=${refresh_token}; ${Object.entries(cookieOptions).map(([k, v]) => `${k}=${v}`).join('; ')}`
        ]
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