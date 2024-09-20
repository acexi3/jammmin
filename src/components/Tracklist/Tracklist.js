import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card, Form } from 'react-bootstrap';

export default function Tracklist({ tracks, onTrackSelect }) {

  console.log("Inside <Tracklist /> module", tracks);

  const handleSelect = (track, e) => {
    onTrackSelect(track, e.target.checked);
  };

  return (
    <div className="Tracklist">
      <Container>
        <Row className="mx2 row row-cols-2">
          { tracks.map((track, i) => (
            <Card key={track.id}>
              <Card.Img src={track.albumArt} />
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
            </Card>
          ))}
        </Row>
      </Container>
    </div>
  );
};
