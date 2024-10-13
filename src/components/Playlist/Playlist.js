import React from 'react'
import { Card, Row, Col } from 'react-bootstrap';
import './Playlist.css';

export default function Playlist({ selectedTracks }) {
  return (
    <div className="PlaylistContainer">
      {selectedTracks.length > 0 && <h3 className="PlaylistHeader">Selected for Your Playlist</h3>}
      
      <div className="PlaylistSongs">
        {selectedTracks.map((track) => (
          <Card 
            className='bg-white text-dark mb-2' 
            key={track.id}>
            <Row className="align-items-center">
              <Col xs={4} className="d-flex justify-content-center">  
                <Card.Img 
                  src={track.albumArt} 
                  alt={`${track.name} album art`}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', padding: '2px' }} 
                />
              </Col>
              <Col xs={8}>  
                <Card.Body>
                  <Card.Title>{track.name}</Card.Title>
                  <Card.Text>{track.artist}</Card.Text>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
}

/*
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Playlist.css';

export default function Playlist({ selectedTracks }) {

  // Display the selected tracks for the Playlist 
  // Selected tracks are passed from App.js
  return (
    <div className="SonglistContainer">
      
      {selectedTracks.length > 0 && <h3 className="PlaylistHeader">Selected for Your Playlist</h3>}
           
        <div className="PlaylistSongs">
        <ul>
          {selectedTracks.map((track, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={track.albumArt}
                alt={`${track.name} album art`}
                style={{ width: '70px', height: '70px', marginRight: '8px', padding: '2px' }}
              />
              {track.name} - {track.artist}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
*/
