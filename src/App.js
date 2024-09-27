import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Hero from './components/Hero/Hero';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// The App component handles all search logic and states

export default function App() {

  // ======================================================================================
  // State Definitions
  // ======================================================================================

  // Search and Tracklist states
  //const [searchInput, setSearchInput] = useState('');
  const [tracks, setTracks] = useState([]);         // Tracks returned from Spotify API search
  const [tracklist, setTracklist] = useState([]);   // Tracks mapped to display in Search Results

  // Store track title, artist & uri for Playlist display
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Store related playlist state variables as a state object
  const [playlistForm, setPlaylistForm] = useState({
    name: '',
    description: '',
    isPublic: true,
  });

  // ======================================================================================
  // Functions
  // ======================================================================================
  
  // Function to handle search logic, accepting tracks
  const handleSearch = (tracks) => {
    setTracks(tracks);
  };

  // UseEffect updating Tracklist state after searches
  useEffect(() => {
    if (tracks.length > 0) {
      const mappedTracks = tracks.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        albumArt: track.album.images[0].url,
        uri: track.uri // Include URI for adding to playlist
      }));
      setTracklist(mappedTracks);
    }
  }, [tracks]);

  // Function to handle track selection
  const handleTrackSelection = (track, isSelected) => {
    if (isSelected) {
      setSelectedTracks((prevTracks) => [...prevTracks, track]);
    } else {
      setSelectedTracks((prevTracks) =>
        prevTracks.filter((t) => t.uri !== track.uri)
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

      // Reset Playlist creator and Search after Playlist is saved
      alert('Playlist created successfully! Open your Spotify app to listen and alter it as you wish!');
      setPlaylistForm({
        name: '',
        description: '',
        isPublic: true,
      });
      setSelectedTracks([]);
      setTracklist([]);
    } catch (error) {
      console.error('Error creating Playlist:', error);
      alert('Failed to create Playlist.');
    }
  };

  return (
    <>
      <div className="App">
        <Container>
          <Row>
            <Col>
              <div>
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}