import React from 'react';
import Connector from '../Connector/Connector';
import SearchBar from '../SearchBar/SearchBar';
import './Hero.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Hero() {
    return (
        <div className="Hero">
            <h1>Looking for Music?</h1>
            <p>Create or otherwise manipulate your Spotify playlists, here.</p><br/>
            <Connector /> 
            <SearchBar />
        </div>
    );
};