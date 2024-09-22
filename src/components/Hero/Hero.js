import React from 'react';
import Connector from '../Connector/Connector';
import SearchBar from '../SearchBar/SearchBar';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import './Hero.css';

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
        <Container>
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