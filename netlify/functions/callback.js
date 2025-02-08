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

  // Get the origin, with fallback values
  const origin = event.headers.origin || event.headers.Origin || 'https://findyournextjam.netlify.app';
  console.log('Request headers:', event.headers);
  console.log('Using origin:', origin);

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

    // Create cookie strings with explicit domain
    const accessTokenCookie = `spotify_access_token=${access_token}; Path=/; Domain=findyournextjam.netlify.app; HttpOnly; Secure; SameSite=Strict; Max-Age=${expires_in}`;
    const refreshTokenCookie = `spotify_refresh_token=${refresh_token}; Path=/; Domain=findyournextjam.netlify.app; HttpOnly; Secure; SameSite=Strict; Max-Age=31536000`;

    console.log('Setting cookies with following attributes:', {
      path: '/',
      domain: 'findyournextjam.netlify.app',
      secure: true,
      sameSite: 'Strict',
      httpOnly: true
    });

    return {
      statusCode: 302,
      headers: {
        'Set-Cookie': accessTokenCookie + ', ' + refreshTokenCookie,
        'Location': 'https://findyournextjam.netlify.app',
        'Cache-Control': 'no-cache'
      }
    };
  } catch (error) {
    console.error('Error in callback:', error);
    return {
      statusCode: 302,
      headers: {
        'Location': 'https://findyournextjam.netlify.app?auth_error=true'
      }
    };
  }
};