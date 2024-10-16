const querystring = require('querystring');
require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

exports.handler = async (event, context) => {
  const state = generateRandomString(16);
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

  return {
    statusCode: 302,
    headers: {
      Location: redirectUrl,
      'Set-Cookie': `spotify_auth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Strict`
    }
  };
};