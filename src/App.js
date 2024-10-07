import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Hero from './components/Hero/Hero';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default function App() {

  // Tracklist states
  const [tracklist, setTracklist] = useState([]);   // Tracks mapped to display in Search Results
  const [selectedTracks, setSelectedTracks] = useState([]); // Store track title, artist & uri for Playlist display

  // Store related playlist state variables as a state object
  const [playlistForm, setPlaylistForm] = useState({
    name: '',
    description: '',
    isPublic: true
  });

  // ======================================================================================
  // Functions & Hooks
  // ======================================================================================
  
  // Function to handle search logic, accepting tracks
  const handleSearch = (searchResults) => {
    setTracklist(searchResults);
  };

  // Function to handle track selection
  const handleTrackSelection = (track, isSelected) => {
    if (isSelected) {
      setSelectedTracks((prevTracks) => [...prevTracks, track]);
    } else {
      setSelectedTracks((prevTracks) =>
        prevTracks.filter((t) => t.id !== track.id)
      );
    }
  };

  // Function to handle Playlist name, description and public/private changes
  const handlePlaylistFormChange = (field, value) => {
    setPlaylistForm(prev => ({ ...prev, [field]: value }));
  };

  // Async Function to create Playlist name/description and add tracks to Playlist
  const createPlaylist = async () => {
    try {
      const user = await spotifyApi.getMe();
      const userId = user.id;

      // Create the Playlist
      const playlist = await spotifyApi.createPlaylist(userId, playlistForm);

      // Then add tracks to the Playlist
      if (selectedTracks.length > 0) {
        const trackURIs = selectedTracks.map((track) => track.uri);
        await spotifyApi.addTracksToPlaylist(playlist.id, trackURIs);
      }

      // Reset Playlist creator and Search states after Playlist is saved
      alert('Playlist created successfully! Open your Spotify app to listen and alter it as you wish!');
      setPlaylistForm({ name: '', description: '', isPublic: true });
      setSelectedTracks([]);
      setTracklist([]);
    } catch (error) {
      console.error('Error creating Playlist:', error);
      alert('Failed to create Playlist.');
    }
  };

  // ======================================================================================
  // Render
  // ====================================================================================== 

  return (
    <>
      <div className="App">
        <Container>
          <Row>
            <Col>              
                <Hero 
                  className="fixed-top" bg="light" expand="lg"
                  playlistForm={playlistForm}
                  onPlaylistFormChange={handlePlaylistFormChange}
                  createPlaylist={createPlaylist}
                  onSearch={handleSearch}
                  tracklist={tracklist}
                  onTrackSelect={handleTrackSelection}
                  selectedTracks={selectedTracks}
                />              
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}