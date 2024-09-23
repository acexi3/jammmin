import React from 'react';
import Connector from '../Connector/Connector';
import SearchBar from '../SearchBar/SearchBar';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Hero.css';
import backgroundImage from '../../images/compose_02.jpg';

export default function Hero({ 
    playlistName, 
    setPlaylistName, 
    description, 
    setDescription, 
    isPublic, 
    setIsPublic, 
    createPlaylist, 
    onSearch }) {
    
    return (
        <Container className="Hero"
        style={{ 
            backgroundImage: `
              linear-gradient(
                90deg, 
                rgba(2,0,36,1) 0%, 
                rgba(42,42,124,1) 37%, 
                rgba(0,212,255,1) 100%
              ), 
              url(${backgroundImage})`,
            backgroundBlendMode: 'overlay', // This keeps the blending effect
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            height: '100vh' // Ensures it covers the viewport height
          }}
        >
            <Row>
                <Col>
                    <div>
                        <h1>Looking for Music?</h1>
                        <h5><p>Create your Spotify playlists with ease, here.</p></h5>
                        <br/>
                        <Connector />
                    </div>
                </Col>
                <Col>
                    <div className="CreatePlaylist">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label><h3>Playlist Name</h3></Form.Label>
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
                            <br></br>
                            <Button variant="primary" onClick={createPlaylist}>
                                Save Playlist to My Spotify
                            </Button>
                        </Form>
                        <br></br>
                    </div>
                </Col>
            </Row>
            {/* SearchBar added to bottom of Hero component */}
            <Row className="mt-3">
                <SearchBar onSearch={onSearch} />
            </Row>
        </Container>
    );
}