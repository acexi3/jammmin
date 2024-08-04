import React, { useState, useEffect } from 'react';
//import styles from './SearchBar';
import SpotifyWebApi from 'spotify-web-api-js';

export default function SearchBar() {

    const spotifyApi = new SpotifyWebApi();
    const [searchInput, setSearchInput] = useState([""]);
    const [searchResult, setSearchResult] = useState([""]);
    
    //Search for song title and return id, name, artists to display to user 
   
    const search = () => {
        spotifyApi.searchTracks().then(searchResponse => {
            console.log(searchResponse);
            setSearchResult({
                id: searchResponse.id,
                name: searchResponse.name,
                artists: searchResponse.artists
            });
        });
    };

    //handles display of typing in search box 
    const handleChange = (event) => {
        event.preventDefault();
        setSearchInput(event.target.value.toLowerCase());
    };

    //runs the search() function
    const handleKeyDown = (event) => {
        if(event.key === "Enter") {
            spotifyApi.setAccessToken(returnedToken);
            search(); 
        }
    };

    //runs the search() function
    const handleClick = (event) => {
        spotifyApi.setAccessToken(returnedToken);
        search();
    };

    //calls token from local storage -- for testing to check value not undefined
    const returnedToken = localStorage.getItem("accessToken");

    return (
        <div className="SearchBar">
            {!returnedToken && <a href="http://localhost:3000">Login to Spotify</a>}
            {returnedToken && (
                <>
                    <input type="text" onKeyDown={handleKeyDown} onChange={handleChange} placeholder="What song are you looking for?"/>
                    <button onClick={handleClick}>Search</button>
                </>
            )}
        </div>
    )
}

