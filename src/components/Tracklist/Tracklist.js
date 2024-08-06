import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';

export default function Tracklist(props) {

  const { tracks } = props;   
  console.log("in Tracklist: ", tracks);

  return (
    <div className="Tracklist">
      <Container>
        <Row className="mx-2 row row-cols-4">
            <Card>
              <Card.Body>
                <Card.Title> Song Name </Card.Title>
                <Card.Text> Band Name </Card.Text>
              </Card.Body>
            </Card>
        </Row>
      </Container>
    </div>
  );

};

