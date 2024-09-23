import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Hero from './components/Hero/Hero';
import Tracklist from './components/Tracklist/Tracklist';
import Playlist from './components/Playlist/Playlist';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// The App component handles all search logic andd states

export default function App() {
  
  // Search and Tracklist states
  const [tracks, setTracks] = useState([]); 
  const [tracklist, setTracklist] = useState([]);

  // Store track title, artist & uri for Playlist display
  const [selectedTracks, setSelectedTracks] = useState([]);

  // Form states for Playlist creation
  const [playlistName, setPlaylistName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Function to handle search logic, accepting tracks
  const handleSearch = (tracks) => {
    setTracks(tracks);
  };

  // UseEffect updating Tracklist state after searches
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

  // Async Function to create Playlist name/description and add tracks to Playlist
  const createPlaylist = async () => {
    try {
      const user = await spotifyApi.getMe();
      const userId = user.id;

      // Create the Playlist
      const playlist = await spotifyApi.createPlaylist(userId, {
        name: playlistName,
        description: description,
        public: isPublic,
      });

      // Add tracks to the Playlist
      if (selectedTracks.length > 0) {
        const trackURIs = selectedTracks.map((track) => track.uri);
        await spotifyApi.addTracksToPlaylist(playlist.id, trackURIs);
      }

      // Reset Playlist creator and Search after Playlist is saved
      alert('Playlist created successfully!');
      setPlaylistName('');
      setDescription('');
      setIsPublic(true);
      setSelectedTracks([]);
      setTracklist([]);
    } catch (error) {
      console.error('Error creating Playlist:', error);
      alert('Failed to create Playlist.');
    }
  };

  return (
    <>
      <div className="App">
        <Container>
          <Row>
            <Col>
              <div>
                <Hero 
                  className="fixed-top" bg="light" expand="lg"
                  playlistName={playlistName}
                  setPlaylistName={setPlaylistName}
                  description={description}
                  setDescription={setDescription}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  createPlaylist={createPlaylist}
                  onSearch={handleSearch}
                />
              </div>
            </Col>
          </Row>
        </Container>
        <Container> 
          <Row>
            <Col>
              {tracklist.length > 0 && (<div className="SearchHeader"><h3>Search Results</h3></div>)}
              <div className="Tracklist">
                <Tracklist tracks={tracklist} onTrackSelect={handleTrackSelection} />
              </div>
            </Col>
            <Col>
              <div className="CreatePlaylist">
                <Playlist selectedTracks={selectedTracks} />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}