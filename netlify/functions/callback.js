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
      statusCode: 302,
      headers: {
        'Location': 'https://findyournextjam.netlify.app?error=no_code'
      }
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

    // Create cookie strings with more specific settings
    const accessTokenCookie = `spotify_access_token=${access_token}; Path=/; Domain=findyournextjam.netlify.app; HttpOnly; Secure; SameSite=Strict; Max-Age=${expires_in}`;
    const refreshTokenCookie = `spotify_refresh_token=${refresh_token}; Path=/; Domain=findyournextjam.netlify.app; HttpOnly; Secure; SameSite=Strict; Max-Age=31536000`;

    console.log('Setting cookies with following attributes:', {
      accessTokenMaxAge: expires_in,
      refreshTokenMaxAge: 31536000,
      domain: 'findyournextjam.netlify.app',
      path: '/',
      secure: true,
      sameSite: 'Strict',
      httpOnly: true
    });

    // Set cookies as separate headers
    return {
      statusCode: 302,
      multiValueHeaders: {
        'Set-Cookie': [
          accessTokenCookie,
          refreshTokenCookie
        ],
        'Cache-Control': ['no-cache, no-store, must-revalidate'],
        'Pragma': ['no-cache'],
        'Expires': ['0']
      },
      headers: {
        'Location': 'https://findyournextjam.netlify.app'
      }
    };
  } catch (error) {
    console.error('Error in callback:', error);
    return {
      statusCode: 302,
      headers: {
        'Location': 'https://findyournextjam.netlify.app?error=auth_failed'
      }
    };
  }
};