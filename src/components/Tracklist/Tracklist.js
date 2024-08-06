import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';

export default function Tracklist(props) {

  console.log("test");
  const { tracks } = props;   
  console.log("in Tracklist: ", tracks);

  return (
    <div className="Tracklist">
      <Container>
        <Row className="mx-2 row row-cols-4">
          { tracks.map((track, i) => {
              console.log(track);
              
              return (
                <Card>
                  <Card.Img src={track.item.album.images[0].url} />
                    <Card.Body>
                      <Card.Title>{track.item.name}</Card.Title>
                      <Card.Text>{track.artists[0].name}</Card.Text>
                    </Card.Body>
                </Card>
              )
          })}
        </Row>
      </Container>
    </div>
  );
}

