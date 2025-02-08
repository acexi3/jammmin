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
  console.log('Request origin:', event.headers.origin || event.headers.Origin);

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

    // Create cookie strings with more permissive settings
    const accessTokenCookie = `spotify_access_token=${access_token}; Path=/; Domain=.netlify.app; HttpOnly; Secure; SameSite=None; Max-Age=${expires_in}`;
    const refreshTokenCookie = `spotify_refresh_token=${refresh_token}; Path=/; Domain=.netlify.app; HttpOnly; Secure; SameSite=None; Max-Age=31536000`;

    console.log('Setting cookies with following attributes:', {
      path: '/',
      domain: '.netlify.app',
      secure: true,
      sameSite: 'None',
      httpOnly: true
    });

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': accessTokenCookie + ', ' + refreshTokenCookie,
        'Access-Control-Allow-Origin': 'https://findyournextjam.netlify.app',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Authentication successful',
        cookiesSet: true
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