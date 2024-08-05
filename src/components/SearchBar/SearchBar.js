import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
//import styles from './SearchBar';
import SpotifyWebApi from 'spotify-web-api-js';

function SearchBar() {

    const spotifyApi = new SpotifyWebApi();
    const [searchInput, setSearchInput] = useState([""]);
    const [tracks, setTracks] = useState([]);
    
    //Update the state of searchResult on every change
    useEffect(() => console.log("Search Result =", tracks), [tracks]);

    //Search for song title and return id, name, artists to display to user 
    const search = () => {
        spotifyApi.searchTracks("q: " + searchInput).then(response => {
            console.log("Raw response : ", response);
            setTracks({
                id: response.tracks.items[0].id,
                name: response.tracks.items[0].name,
                artist: response.tracks.items[0].artists[0].name
            });
        });
        console.log(tracks);
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
            console.log(searchInput);
            search(); 
        }
    };

    //runs the search() function
    const handleClick = () => {
        spotifyApi.setAccessToken(returnedToken);
        search();
    };

    //calls token from local storage -- for testing to check value not undefined
    const returnedToken = localStorage.getItem("accessToken");

    return (
        <div className="SearchBar">
          <Container>
            <InputGroup className="mb-3" size="lg">
              <FormControl
                type="input"
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                placeholder="What song are you looking for?"
                width="200px"
              />
              <Button onClick={handleClick}>Search</Button>  
            </InputGroup>
          </Container>
        </div>

/*    return (
        <div className="SearchBar">
            {!returnedToken && <a href="http://localhost:3000">Login to Spotify</a>}
            {returnedToken && (
                <>
                    <input  type="text" 
                            width="250px" 
                            value={searchInput} 
                            onChange={handleChange} 
                            onKeyDown={handleKeyDown} 
                            placeholder="What song are you looking for?"/>
                    <button onClick={handleClick}>Search</button>
                </>
            )}
        </div>
*/
    )
}

export default SearchBar;