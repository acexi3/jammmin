import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';

export default function Tracklist(props) {

  const { tracks } = props;   

  return (
    <div>
      <Container>
        <Row className="mx-2 row row-cols-4">
         {tracks.map((track, i) => (
            <Card key={i}>
                <Card.Body>
                  <Card.Title>{track.name}</Card.Title>
                  <Card.Text>{track.name}</Card.Text>
                </Card.Body>
              </Card>
            ))}
        </Row>
      </Container>
    </div>
  );
};

