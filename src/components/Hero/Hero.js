import React from 'react';
import Connector from '../Connector/Connector';
import './Hero.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Hero() {
    
    return (
        <div className="Hero">
            <h1>Looking for Music?</h1>
            <p>Create your Spotify playlists with ease, here.</p><br/>
            <Connector /> 
        </div>
    );
};