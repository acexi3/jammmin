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
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, description, isPublic, tracks } = JSON.parse(event.body);
  const accessToken = event.headers.cookie?.match(/spotify_access_token=([^;]+)/)?.[1];

  if (!accessToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: 'No access token found' })
    };
  }

  spotifyApi.setAccessToken(accessToken);

  try {
    const playlist = await spotifyApi.createPlaylist(name, { 'public': isPublic, 'description': description });
    console.log('Playlist created:', playlist.body);

    const addTracksResult = await spotifyApi.addTracksToPlaylist(playlist.body.id, tracks);
    console.log('Tracks added to playlist:', addTracksResult.body);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Playlist created successfully',
        playlistId: playlist.body.id,
        addedTracks: addTracksResult.body.snapshot_id
      })
    };
  } catch (error) {
    console.error('Error in create playlist:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Failed to create playlist', error: error.message })
    };
  }
};