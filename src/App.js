import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Hero from './components/Hero/Hero';
import SearchBar from './components/SearchBar/SearchBar';
import Tracklist from './components/Tracklist/Tracklist';
import './App.css';

export default function App() {
 
  const [tracks, setTracks] = useState([]);
  const [tracklist, setTracklist] = useState([]); // new state, extracted mapped array
  
  console.log("Tracks set in App via SearchBar function: ", tracks);

  const handleSearch = (tracks) => { 
    setTracks(tracks); 
  }; // set the tracks state

  console.log("Tracks after handleSearch: ", tracks);

  useEffect(() => {
    if (tracks.length > 0) {
      const mappedTracks = tracks.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        albumArt: track.album.images[0].url
      }));  
      setTracklist(mappedTracks); // update the tracklist state
    }
  }, [tracks]);      

  console.log("tracklist, to be passed into <Tracklist />: ", JSON.stringify(tracklist, null, 2));

  return (
    <>
      <div className="App">
        <Container>
          <Row>
            <Col>
              <div className="Hero"><Hero /></div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="SearchBar"><SearchBar onSearch={handleSearch} /></div>
            </Col>
          </Row>
          <Row>
            <Col>
            <div className="ResultsHeader">Search Results</div>
            <div className="Tracklist"><Tracklist tracks={tracklist} /></div></Col>
            <Col>Create Your Playlist</Col>
            
          </Row>
          <Row>
            <Col>1 of 3</Col>
            <Col>2 of 3</Col>
            <Col>3 of 3</Col>
          </Row>
        </Container>
      </div>
    </> 
  );
};