import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Hero from './components/Hero/Hero';
import SearchBar from './components/SearchBar/SearchBar';
import Tracklist from './components/Tracklist/Tracklist';
import Playlist from './components/Playlist/Playlist';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default function App() {
  
  // Search and Tracklist states
  const [tracks, setTracks] = useState([]); 
  const [tracklist, setTracklist] = useState([]);

  // Store track title, artist & uri for Playlist display
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Form states for Playlist creation
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Handle search logic
  const handleSearch = (tracks) => {
    setTracks(tracks);
  };

  // Update Tracklist state after search
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

  // Create Playlist name/description and add tracks to it
  const createPlaylist = async () => {
    try {
      const user = await spotifyApi.getMe();
      const userId = user.id;

      // Create the Playlist
      const playlist = await spotifyApi.createPlaylist(userId, {
        name: playlistName,
        description: description,
        public: isPublic,
      });

      // Add tracks to the Playlist
      if (selectedTracks.length > 0) {
        const trackURIs = selectedTracks.map((track) => track.uri);
        await spotifyApi.addTracksToPlaylist(playlist.id, trackURIs);
      }

      alert('Playlist created successfully!');
      setPlaylistName('');
      setDescription('');
      setIsPublic(true);
      setSelectedTracks([]);
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
              <div className="Hero">
                <Hero 
                  playlistName={playlistName}
                  setPlaylistName={setPlaylistName}
                  description={description}
                  setDescription={setDescription}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  createPlaylist={createPlaylist}
                />
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <div className="SearchBar">
                <SearchBar onSearch={handleSearch} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="ResultsHeader">Search Results</div>
              <div className="Tracklist">
                <Tracklist tracks={tracklist} onTrackSelect={handleTrackSelection} />
              </div>
            </Col>
            <Col>
              <div className="CreatePlaylist">
                <Playlist selectedTracks={selectedTracks} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}