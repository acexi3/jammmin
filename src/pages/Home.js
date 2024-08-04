import React from 'react';
import NavBar from '../components/NavBar/NavBar';
import Hero from '../components/Hero/Hero';

export default function Home() {
    return (
        <>
            <NavBar />
            <div>
                <div className="Home">    
                    {/*<img src={logo} className="App-logo" alt="logo" />*/}
                    <Hero />
                </div>
            </div>
        </>    
    );
};