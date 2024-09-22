import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, Form } from 'react-bootstrap';

export default function Tracklist({ tracks, onTrackSelect }) {

  console.log("Inside <Tracklist /> module", tracks);

  const handleSelect = (track, e) => {
    onTrackSelect(track, e.target.checked);
  };

  // Tracklist cards
  return (
    <div className="Tracklist">{ tracks.map((track, i) => (
      
        <Card className='bg-dark text-white mb-3' 
          key={track.id}>
          {/* Card row for layout */}
          <Row className="TrackContainer align-items-center">
            
            {/* Column containing centered album image */}
            <Col xs={4} className="d-flex justify-content-center">  
              <Card.Img 
                src={track.albumArt} 
                alt={`${track.name} album art`}
                style={{ width: '150px', height: '150px', objectFit: 'cover', padding: '5px' }} 
              />
            </Col>
            
            {/* Column containing text and checkbox */}
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
    </div>
  );
}
