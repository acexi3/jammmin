import React, { useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import Hero from '../components/Hero/Hero';
import Tracklist from '../components/Tracklist/Tracklist';

export default function Home(props) {

    const [ tracks ] = useState([]); //tracks state defined in the Home component 

    console.log("Home rendered");

    return (
        <>
            <NavBar />
            <div>
                <div className="Home">    
                    <Hero tracks={tracks} />
                </div>
                <div className="Tracklist">
                    <Tracklist tracks={tracks} />
                </div>
            </div>
        </>    
    );
};