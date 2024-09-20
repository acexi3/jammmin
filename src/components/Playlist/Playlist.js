import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default function Playlist({ selectedTracks, resetPlaylist }) {
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Confirm user authorization
  const createPlaylist = async () => {
    try {
      const user = await spotifyApi.getMe();
      const userId = user.id;

      // Create the playlist
      const playlist = await spotifyApi.createPlaylist(userId, {
        name: playlistName,
        description: description,
        public: isPublic,
      });

      // Add tracks to the playlist
      if (selectedTracks.length > 0) {
        const trackURIs = selectedTracks.map((track) => track.uri);
        await spotifyApi.addTracksToPlaylist(playlist.id, trackURIs);
      }

      alert(`Playlist created successfully!`);
      resetPlaylist(); // Reset playlist after saving
      setPlaylistName(''); // Clear playlist name
      setDescription(''); // Clear description
      setIsPublic(true);  // Reset public checkbox to default
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('Failed to create playlist.');
    }
  };

  return (
    <div className="CreatePlaylist">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Playlist Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter playlist name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Playlist Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Form.Check
          type="checkbox"
          label="Public"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />

        <Button variant="primary" onClick={createPlaylist}>
          Save Playlist
        </Button>
      </Form>

      <br></br>
      <h3>Selected Tracks</h3>
      <ul>
        {selectedTracks.map((track, index) => (
          <li key={index}>
            {track.name} - {track.artist}
          </li>
        ))}
      </ul>
    </div>
  );
};