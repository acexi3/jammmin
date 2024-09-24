import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Row, Col, Form } from 'react-bootstrap';
import './Tracklist.css';

export default function Tracklist({ tracks, onTrackSelect }) {

  console.log("Inside <Tracklist /> module", tracks);

  const handleSelect = (track, e) => {
    onTrackSelect(track, e.target.checked);
  };

  // Search Results: Tracklist cards
  return (
    <div className="TracklistContainer"> {/*Container for individual track Cards*/} 
      <Container>

      {/*Iterate through tracks array to display each search result track on a Card*/}
        { tracks.map((track, i) => (
          
        <Card 
          className='bg-dark text-white mb-2' 
          key={track.id}>
          
          {/* Card row for track layout, contains two columns: 1. image and 2. info/checkbox */}
          <Row 
            className="TrackContainer align-items-center"
            box-shadow="0 4px 8px rgba(0, 0, 0, 0.1)">
            
            {/* Column one containing centered album image */}
            <Col xs={4} className="d-flex justify-content-center">  
              <Card.Img 
                src={track.albumArt} 
                alt={`${track.name} album art`}
                style={{ width: '120px', height: '120px', objectFit: 'cover', padding: '2px' }} 
              />
            </Col>
            
            {/* Column two containing text and checkbox */}
            <Col xs={8}>  
              <Card.Body>
                <Card.Title>{track.name}</Card.Title>
                <Card.Text>{track.artist}</Card.Text>
                <Card.Text>{track.album}</Card.Text>
                <Form.Check
                  type="checkbox"
                  label="Select"
                  onChange={(e) => handleSelect(track, e)}
                />
              </Card.Body>
            </Col>
          </Row>
        </Card>
        
        ))}

      </Container>
    </div>
  );
}
