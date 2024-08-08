import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Card } from 'react-bootstrap';

export default function Tracklist(props) {

  if (!props.tracklist) return <div>Loading...</div>;

  return (
    <div className="Tracklist">
      <Container>
        <Row className="mx-2 row row-cols-4">
          { props.tracklist.map((track, i) => {
              console.log(track);
              
              return (
                <Card>
                  <Card.Img src={track.album.images[0].url} />
                    <Card.Body>
                      <Card.Title>{track.name}</Card.Title>
                      <Card.Text>{track.artists[0].name}</Card.Text>
                      <Card.Text>{track.album.name}</Card.Text>
                    </Card.Body>
                </Card>
              )
          })}
        </Row>
      </Container>
    </div>
  );
}

/*  

return (

    <div className="Tracklist">
      <Container>
        <Row className="mx-2 row row-cols-4">
          <Card>
            <Card.Body>
              <Card.Title>Song Title</Card.Title>
              <Card.Text>Artist</Card.Text>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </div>
  );
};
*/
