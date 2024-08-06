import React, { useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import Hero from '../components/Hero/Hero';
import Tracklist from '../components/Tracklist/Tracklist';

export default function Home() {

    const [tracks, setTracks] = useState([]); //tracks state defined in the Home component 

    return (
        <>
            <NavBar />
            <div>
                <div className="Home">    
                    <Hero />
                </div>
                <div className="Tracklist">
                    <Tracklist tracks={tracks} />
                </div>
            </div>
        </>    
    );
};