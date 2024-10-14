import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button } from 'react-bootstrap';
import './Tracklist.css';

export default function Tracklist({ tracks, onTrackSelect }) {
  const [playingTrack, setPlayingTrack] = useState(null);

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

  return (
    <div className="TracklistContainer">
      {tracks.map((track) => (
        <Card 
          className='bg-dark text-white mb-2' 
          key={track.id}>
          <Row className="TrackContainer align-items-center">
            <Col xs={4} className="d-flex justify-content-center">  
              <Card.Img 
                src={track.albumArt} 
                alt={`${track.name} album art`}
                style={{ width: '110px', height: '110px', objectFit: 'cover', padding: '2px' }} 
              />
            </Col>
            <Col xs={8}>  
              <Card.Body>
                <Card.Title>{track.name}</Card.Title>
                <Card.Text>{track.artist} - {track.album}</Card.Text> 
                <div className="d-flex justify-content-between align-items-center">
                  <Button 
                    variant="outline-light"
                    size="sm"
                    onClick={() => handlePlay(track.previewUrl)}
                    disabled={!track.previewUrl}>
                      {track.previewUrl ? 'Play me' : 'No Preview'}
                  </Button>
                  <Form.Check
                    type="checkbox"
                    label="Pick me!"
                    onChange={(e) => handleSelect(track, e)}
                  />
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
}