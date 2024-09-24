import React from 'react';
import Connector from '../Connector/Connector';
import SearchBar from '../SearchBar/SearchBar';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Hero.css';
import backgroundImage from '../../images/compose_01.jpg';

// The Hero is the app, essentially. The hub of functionality.
// Parent of Connector, Playlist, SearchBar and Tracklist components.

export default function Hero({ 
    playlistName, 
    setPlaylistName, 
    description, 
    setDescription, 
    isPublic, 
    setIsPublic, 
    createPlaylist, 
    onSearch,
    tracklist,
    onTrackSelect,
    selectedTracks }) {
    
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
                        <Connector />
                    </div>
                </Col>
                {/* Playlist Creator - name & describe your playlist, public or private and save it */}
                <Col className="PlaylistCreator">
                    <div>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label><h3>Playlist Name</h3></Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="What will you call it?"
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
                            <br></br>
                            <Button variant="primary" onClick={createPlaylist}>
                                Save Playlist to My Spotify
                            </Button>
                        </Form>
                        <br></br>
                    </div>
                </Col>
            </Row>
            {/* Row two with one column: SearchBar - to search for songs and-or artists */}
            <Row className="mt-3">
                <SearchBar onSearch={onSearch} />
            </Row>
            <Row> {/* Row three with two columns/sections: 1. Search results (tracklist) 2. Tracks to add to playlist */}
                <Col className="Tracklist">
                    {tracklist.length > 0}
                    <div>
                        <Tracklist tracks={tracklist} onTrackSelect={onTrackSelect} />
                    </div>
                </Col>
                
                <Container className="PlaylistContainer">              
                    <div>
                        <Playlist selectedTracks={selectedTracks} />
                    </div>
                </Container>
                
          </Row>
        </Container>
    );
}