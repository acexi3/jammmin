import React, { useState, useEffect } from 'react';
import Connector from '../Connector/Connector';
import SearchBar from '../SearchBar/SearchBar';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Hero.css';
import axios from 'axios';
import backgroundImage from '../../images/compose_02.jpg';

export default function Hero() {
  // State definitions
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tracklist, setTracklist] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [playlistForm, setPlaylistForm] = useState({
    name: '',
    description: '',
    isPublic: true
  });

  // ======================================================================================
  // Functions & Hooks
  // ======================================================================================
    
    // Log the access and refresh tokens to the console when changed
    useEffect(() => {
        console.log("Access Token changed:", accessToken);
    }, [accessToken]);

    useEffect(() => {
        console.log("Refresh Token changed:", refreshToken);
    }, [refreshToken]);
    
    // Log a message when the access token is available for API calls
    useEffect(() => {
        if (accessToken) {
            console.log('Access Token is available for API calls.');
        }
    }, [accessToken]);

    // Functions to handle changes to the access and refresh tokens
    const handleAuthChange = (authStatus) => {
        setIsAuthenticated(authStatus);
    }

    const handleAccessTokenChange = (newToken) => {
        console.log("Setting new access token:", newToken);
        setAccessToken(newToken);
    }

    const handleRefreshTokenChange = (newToken) => {
        console.log("Setting new refresh token:", newToken);
        setRefreshToken(newToken);
    }

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

    const createPlaylist = async () => {
        try {
          const response = await axios.post('http://localhost:3001/api/create-playlist', {
            name: playlistForm.name,
            description: playlistForm.description,
            isPublic: playlistForm.isPublic,
            tracks: selectedTracks.map(track => track.uri)
          }, {
            withCredentials: true
          });
    
          if (response.data.success) {
            alert('Playlist created successfully!');
            setPlaylistForm({ name: '', description: '', isPublic: true });
            setSelectedTracks([]);
          } else {
            throw new Error(response.data.error);
          }
        } catch (error) {
          console.error('Error creating playlist:', error);
          alert('Failed to create playlist. Please try again.');
        }
      };
 
  // ======================================================================================
  // Render
  // ====================================================================================== 

    return (
        <Container className="HeroContainer"
            style={{ 
                backgroundImage: `
                linear-gradient(
                    90deg, 
                    rgba(2,0,36,1) 0%, 
                    rgba(42,42,124,1) 37%, 
                    rgba(0,212,255,1) 100%
                ), 
                url(${backgroundImage || ''})`,
                backgroundBlendMode: 'overlay', // Blending effect
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                height: '40vh', // Ensures it covers the viewport height
          }}
        >
            <Row> {/* Row one with two columns/sections: 1. Login to Spotify 2. Create Playlist */}
                {/* Connector - user access to Spotify account, retrieve auth token */}
                <Col className="Authentication">
                    <div>
                        <h1>Looking for Music?</h1>
                        <h5><p>Create your Spotify playlists with ease, here.</p></h5>
                        <br/>
                        <Connector 
                            onAuthChange={handleAuthChange}
                            isAuthenticated={isAuthenticated}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            setIsAuthenticated={setIsAuthenticated}
                            onAccessTokenChange={handleAccessTokenChange}
                            onRefreshTokenChange={handleRefreshTokenChange}
                        />
                    </div>
                </Col>
                {/* Playlist Creator - name & describe your playlist, public or private and save it */}
                <Col className="PlaylistCreator">
                    <div>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label><h5>This is Your Playlist:</h5></Form.Label>
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
                            <br />
                            <Button variant="primary" onClick={createPlaylist}>
                                Save Playlist to My Spotify
                            </Button>
                        </Form>
                        <br />
                    </div>
                </Col>
            </Row>
            {/* Row two with one column: SearchBar - to search for songs and-or artists */}
            <Row className="mt-3">
                <SearchBar onSearch={handleSearch} accessToken={accessToken} />
            </Row>
            <Row> {/* Row three with two columns/sections: 1. Search results (tracklist) 2. Tracks to add to playlist */}
                <Col className="Tracklist">
                    {tracklist.length > 0}
                    <div>
                        <Tracklist tracks={tracklist} onTrackSelect={handleTrackSelection} />
                    </div>
                </Col>
                
                <Container className="PlaylistContainer">              
                    <div>
                        <Playlist 
                            isAuthenticated={isAuthenticated}
                            setIsAuthenticated={setIsAuthenticated}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            selectedTracks={selectedTracks}
                            playlistForm={playlistForm}
                            onPlaylistFormChange={handlePlaylistFormChange}
                            createPlaylist={createPlaylist}
                        />
                    </div>
                </Container>  
            </Row>
        </Container>
    );
}