import React, { useState } from 'react';
import Connector from '../Connector/Connector';
import SearchBar from '../SearchBar/SearchBar';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Hero.css';
import axios from 'axios';
import backgroundImage from '../../images/compose_02.jpg';

export default function Hero() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const [playlistForm, setPlaylistForm] = useState({ name: '', description: '', isPublic: true });
  const [tracklist, setTracklist] = useState([]);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  
  // Functions

  const handleAuthChange = (authStatus) => {
    setIsAuthenticated(authStatus);
  };

  const handleAccessTokenChange = (token) => {
    setAccessToken(token);
  };

  const handleRefreshTokenChange = (token) => {
    // Implement if needed
  };

  const handleSearch = (searchResults) => {
    setTracklist(searchResults);
    // Reset scroll position of TracklistContainer
    const tracklistContainer = document.querySelector('.TracklistContainer');
    if (tracklistContainer) {
      tracklistContainer.scrollTop = 0; 
    }
  }; 

  const handleTrackSelection = (track, isSelected) => {
    if (isSelected) {
      setSelectedTracks(prev => [...prev, track]);
    } else {
      setSelectedTracks(prev => prev.filter(t => t.id !== track.id));
    }
  };

  const handlePlaylistFormChange = (field, value) => {
    setPlaylistForm(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setPlaylistForm({ name: '', description: '', isPublic: true });
    setSelectedTracks([]);
    setTracklist([]);
  };

  // Function: Create Playlist
  const createPlaylist = async () => {
    if (!playlistForm.name) {
      alert('Please enter a name for your playlist.');
      return;
    }
    try {
      const response = await axios.post(`${apiBaseUrl}/create-playlist`, {
        name: playlistForm.name,
        description: playlistForm.description,
        isPublic: playlistForm.isPublic,
        tracks: selectedTracks.map(track => track.uri)
      }, {
        withCredentials: true,
        timeout: 30000 // 30 second timeout
      });
      if (response.data.success) {
        alert('Playlist created successfully! Log into your Spotify App to listen. Note: it may take a few minutes to load on your account.');
        // Reset form, selected tracks and tracklist
        setPlaylistForm({ name: '', description: '', isPublic: false });
        setSelectedTracks([]);
        setTracklist([]);
      } else {
        alert(`Failed to create playlist: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      if (error.code === 'ECONNABORTED') {  
        alert('The request to create your playlist timed out. Please try again.');
      } else {
        alert(`An error occurred while creating the playlist: ${error.response?.data?.message || error.message}`);
      }
    }
  };

/**************************************************************** */
// Render
/************************************************************** */

return (
    <Container fluid className="Hero p-0">
      <div className="hero-background" style={{ 
        backgroundImage: `linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(42,42,124,1) 37%, rgba(0,212,255,1) 100%), url(${backgroundImage || ''})`,
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}>
        <Container className="hero-EngineContainer pt-0">
          {/* Hero Engine - Contains Spotify Login, Playlist Creation Form & Search Bar */}
          <Row className="py-2">
            <Col md={6} className="mb-4 mb-md-0">
              <h1>Looking for Music?</h1>
              <h5><p>Create your Spotify playlists with ease, here.</p></h5>
              <Connector 
                onAuthChange={handleAuthChange}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onAccessTokenChange={handleAccessTokenChange}
                onRefreshTokenChange={handleRefreshTokenChange}
              />
            </Col>
            <Col md={6}>
              <Form>
                <h5>This is Your Playlist:</h5>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="What will you call it?"
                    value={playlistForm.name}
                    onChange={(e) => handlePlaylistFormChange('name', e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Playlist Description (optional)"
                    value={playlistForm.description}
                    onChange={(e) => handlePlaylistFormChange('description', e.target.value)}
                  />
                </Form.Group>
                <Form.Check
                  type="checkbox"
                  label="Public"
                  checked={playlistForm.isPublic}
                  onChange={(e) => handlePlaylistFormChange('isPublic', e.target.checked)}
                />
                <div className="custom-button d-flex justify-content-between">
                    <Button className="custom-button mt-4" onClick={createPlaylist}>
                    Save Playlist to My Spotify
                    </Button>
                    <Button className="custom-button reset mt-4" onClick={handleReset}>
                    Reset
                    </Button>
                </div>
              </Form>
            </Col>
          </Row>
          <Row>
            <SearchBar onSearch={handleSearch} accessToken={accessToken} />
          </Row> 
        </Container>
      </div>
      <Container className="mt-4">
        
        <Row className="mt-4 scrollable-content">
          <Col md={6} className="mb-4 mb-md-0">
            <Tracklist tracks={tracklist} onTrackSelect={handleTrackSelection} />
          </Col>
          <Col md={6}>
            <Playlist 
              selectedTracks={selectedTracks}
              playlistForm={playlistForm}
              onPlaylistFormChange={handlePlaylistFormChange}
              createPlaylist={createPlaylist}
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}