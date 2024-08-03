import React from 'react';
import Connector from '../Connector/Connector';
import './Hero.css';

export default function Hero() {
    return (
        <div className="Hero">
            <h1>Looking for Music?</h1>
            <p>Create or otherwise manipulate your Spotify playlists, here.</p><br/>
            <Connector /> 
        </div>
        
    );
};