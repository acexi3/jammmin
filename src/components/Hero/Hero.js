import React, { useState, useEffect } from 'react';
import Connector from '../Connector/Connector';
import SearchBar from '../SearchBar/SearchBar';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Hero.css';
import backgroundImage from '../../images/compose_01.jpg';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// The Hero is the app, essentially. The hub of functionality.
// Parent of Connector, Playlist, SearchBar and Tracklist components.

export default function Hero() 
{ 
    const [accessToken, setAccessToken] = useState(null); // State to hold the access token
    const [refreshToken, setRefreshToken] = useState(null); // State to hold the refresh token
    const [tracklist, setTracklist] = useState([]);   // Tracks mapped to display in Search Results
    const [selectedTracks, setSelectedTracks] = useState([]); // Store track title, artist & uri for Playlist display
    const [playlistForm, setPlaylistForm] = useState({ // Store Playlist name, description and public/private
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
    const handleAccessTokenChange = (newToken) => {
        console.log("Setting new access token:", newToken);
        setAccessToken(newToken);
    }

    const handleRefreshTokenChange = (newToken) => {
        console.log("Setting new refresh token:", newToken);
        setRefreshToken(newToken);
    }

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
            spotifyApi.setAccessToken(accessToken); // Set the access token for the Spotify Web API

            const user = await spotifyApi.getMe();
            const userId = user.id;
            const playlist = await spotifyApi.createPlaylist(userId, playlistForm); // Create the Playlist

        if (selectedTracks.length > 0) { // Then add tracks to the Playlist
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
            if (error.status === 401) { // If access token is expired/unauthorized access
                console.log('Token is expired. Attempting to refresh...');
                // Assuming refreshToken is available and updates the token 
                const refreshed = await refreshToken();
                if (refreshed) {
                    console.log('Token refreshed, retrying playlist creation.');
                    createPlaylist(); // Retry creating the Playlist
                } else {
                    console.log('Failed to refresh token. Log in again.');
                    alert('Your session has expired. Please log in again.');
                }
            } else {
                alert('Failed to create Playlist. Please try again');
            }
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
                url(${backgroundImage})`,
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
                            accessToken={accessToken} 
                            refreshToken={refreshToken} 
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