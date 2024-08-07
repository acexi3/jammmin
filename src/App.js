import React from 'react';
import Hero from './components/Hero/Hero';
import SearchBar from './components/SearchBar/SearchBar';
import Tracklist from './components/Tracklist/Tracklist';

export default function App() {
 

//    console.log(tracks);

    return (
      <>
        <div>
          <div className="App">   
            <Hero />
          </div>
          <div className="SearchBar">
            <SearchBar />
          </div>
          <div className="Tracklist">
            <Tracklist />
          </div>
        </div>
      </>    
    );
};