import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Hero from './components/Hero/Hero';
import SearchBar from './components/SearchBar/SearchBar';
import Tracklist from './components/Tracklist/Tracklist';
import Playlist from './components/Playlist/Playlist';
import './App.css';

export default function App() {
  const [tracks, setTracks] = useState([]);
  const [tracklist, setTracklist] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]); // Store track details (title, artist, uri)

  // Handle search logic
  const handleSearch = (tracks) => {
    setTracks(tracks);
  };

  // Update tracklist state after search
  useEffect(() => {
    if (tracks.length > 0) {
      const mappedTracks = tracks.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        albumArt: track.album.images[0].url,
        uri: track.uri // Include URI for adding to playlist
      }));
      setTracklist(mappedTracks);
    }
  }, [tracks]);

  // Function to handle track selection
  const handleTrackSelection = (track, isSelected) => {
    if (isSelected) {
      setSelectedTracks((prevTracks) => [...prevTracks, track]);
    } else {
      setSelectedTracks((prevTracks) =>
        prevTracks.filter((t) => t.uri !== track.uri)
      );
    }
  };

  // Function to reset playlist after saving
  const resetPlaylist = () => {
    setSelectedTracks([]); // Clear selected tracks
  };

  return (
    <>
      <div className="App">
        <Container>
          <Row>
            <Col>
              <div className="Hero"><Hero /></div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              <div className="SearchBar"><SearchBar onSearch={handleSearch} /></div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="ResultsHeader">Search Results</div>
              <div className="Tracklist">
                <Tracklist tracks={tracklist} onTrackSelect={handleTrackSelection} />
              </div>
            </Col>
            <Col>
              <div className="CreatePlaylist">
                <Playlist selectedTracks={selectedTracks} resetPlaylist={resetPlaylist} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}