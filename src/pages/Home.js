import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import Hero from '../components/Hero/Hero';
import Tracklist from '../components/Tracklist/Tracklist';

export default function Home() {
    return (
        <>
            <NavBar />
            <div>
                <div className="Home">    
                    <Hero />
                </div>
                <div className="Tracklist">
                    <Tracklist />
                </div>
            </div>
        </>    
    );
};