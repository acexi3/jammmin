import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';

export default function Tracklist({ tracks }) {

  console.log("Inside <Tracklist /> module", tracks);

  return (
    <div className="Tracklist">
      <Container>
        <Row className="mx2 row row-cols-2">
          { tracks.map((track, i) => {
              console.log("track being mapped", track);
              
              return (
                <Card>
                  <Card.Img src={track.albumArt} />
                    <Card.Body>
                      <Card.Title>{track.name}</Card.Title>
                      <Card.Text>{track.artist}</Card.Text>
                      <Card.Text>{track.album}</Card.Text>
                    </Card.Body>
                </Card>
              )
          })}
        </Row>
      </Container>
    </div>
  );
}