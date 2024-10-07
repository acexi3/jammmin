import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import './Tracklist.css';

export default function Tracklist({ tracks, onTrackSelect }) {

  const [playingTrack, setPlayingTrack] = useState(null); 
  
  console.log("Inside <Tracklist /> module", tracks);

  // Function to handle the selection of a track
  useEffect(() => {
    return () => {
    if (playingTrack) {
        playingTrack.pause();
      }
    };
  }, [playingTrack]);

  const handleSelect = (track, e) => {
    onTrackSelect(track, e.target.checked);
  };

  const handlePlay = (previewUrl) => {
    if (playingTrack) {
      playingTrack.pause();
    }
    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio.play();
      setPlayingTrack(audio);
    } else {
      alert("No preview available for this track.");
    }
  };

  // Search Results: Tracklist cards
  return (
    <div className="TracklistContainer"> {/*Container for individual track Cards*/} 
      <Container>
      {/*Iterate through tracks array to display each search result track on a Card*/}
        { tracks.map((track) => (
        <Card 
          className='bg-dark text-white mb-2' 
          key={track.id}>
          {/* Card row for track layout, contains two columns: 1. image and 2. info/checkbox */}
          <Row 
            className="TrackContainer align-items-center"
            style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"}}>
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
                <Button 
                  variant="outline-light"
                  size="sm"
                  onClick={() => handlePlay(track.previewUrl)}
                  disabled={!track.previewUrl}>
                    {track.previewUrl ? 'Play' : 'No Preview'}
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </Card>
        ))}
      </Container>
    </div>
  );
}