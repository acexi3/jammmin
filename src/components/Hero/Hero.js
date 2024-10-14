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
  const [playlistForm, setPlaylistForm] = useState({ name: '', description: '', isPublic: false });
  const [tracklist, setTracklist] = useState([]);

  // Keep all your existing functions here

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

  // Function: Create Playlist
  const createPlaylist = async () => {
    if (!playlistForm.name) {
      alert('Please enter a name for your playlist.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/api/create-playlist', {
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
        // Reset form and selected tracks
        setPlaylistForm({ name: '', description: '', isPublic: false });
        setSelectedTracks([]);
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

  return (
    <Container fluid className="HeroContainer p-0">
      <div className="hero-background" style={{ 
        backgroundImage: `linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(42,42,124,1) 37%, rgba(0,212,255,1) 100%), url(${backgroundImage || ''})`,
        backgroundBlendMode: 'overlay',
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
      }}>
        <Container>
          <Row className="py-5">
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
                <Button variant="primary" onClick={createPlaylist} className="mt-3">
                  Save Playlist to My Spotify
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="mt-4">
        <Row>
          <Col>
            <SearchBar onSearch={handleSearch} accessToken={accessToken} />
          </Col>
        </Row>
        <Row className="mt-4">
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