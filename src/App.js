import React, { useState, useEffect } from 'react';
import Hero from './components/Hero/Hero';
import SearchBar from './components/SearchBar/SearchBar';
import Tracklist from './components/Tracklist/Tracklist';

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
        <div className="Hero"><Hero /></div>
        <div className="SearchBar"><SearchBar onSearch={handleSearch} /></div>
        <div className="Tracklist"><Tracklist tracks={tracklist} /></div>
      </div>
    </>    
  );
};