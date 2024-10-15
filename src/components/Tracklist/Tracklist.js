import React, { useState, useEffect } from 'react';
import { Card, Col, Form, Button } from 'react-bootstrap';
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
        <Card key={track.id} className="TrackContainer bg-dark text-white mb-2">
          <Card.Body className="d-flex align-items-center justify-content-center">  
            <Col className="ImageContainer">
              <Card.Img
                src={track.albumArt} 
                alt={`${track.name} album art`}
                style={{ width: '110px', height: '110px', objectFit: 'cover', padding: '2px' }} 
              />
            </Col>  
            <Col className="TrackDetailContainer d-flex flex-column">  
              <Card.Title>{track.name}</Card.Title>
              <Card.Text>{track.artist} - {track.album}</Card.Text> 
              <Button 
                variant="outline-light"
                size="sm"
                onClick={() => handlePlay(track.previewUrl)}                  
                disabled={!track.previewUrl}
                className="mb-2">
                {track.previewUrl ? 'Play me' : 'No Preview'}
              </Button>
            </Col>
            <Col className="SelectSongContainer d-flex justify-content-center">
              <Form.Check                
                type="checkbox"
                label="Pick me!"
                onChange={(e) => handleSelect(track, e)}                
              />  
            </Col>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}