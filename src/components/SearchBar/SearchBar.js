import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
//import styles from './SearchBar';
import SpotifyWebApi from 'spotify-web-api-js';

export default function SearchBar() {

    const spotifyApi = new SpotifyWebApi();
    const [searchInput, setSearchInput] = useState([""]);
    const [tracks, setTracks] = useState([]);
    
    //Search for song title and return id, name, artists to display to user 
    const search = () => {
        spotifyApi.searchTracks("q: " + searchInput).then(response => {
            console.log("Raw response : ", response);
            setTracks(response.tracks.items.map(item => ({
                id: item.id,
                name: item.name,
                artist: item.artists[0].name,
                albumArt: item.album.images[0].url
            })));
        });
    };
    
    console.log("'tracks' after mapping: ", tracks);
    
    const returnedToken = localStorage.getItem("accessToken");

    return (
        <div className="SearchBar">
          <Container>
            <InputGroup className="mb-3" size="lg">
                <FormControl
                    type="input"
                    onKeyDown={(event) => { 
                        if (event.key === "Enter") { 
                            spotifyApi.setAccessToken(returnedToken);
                            search(); 
                    }}}
                    onChange={(event) => {
                        setSearchInput(event.target.value.toLowerCase())
                    }}
                    placeholder="What song are you looking for?"
                    width="200px"
                />
                <Button onClick={() => { spotifyApi.setAccessToken(returnedToken);
                                                search();}}>Search</Button>  
            </InputGroup>
          </Container>
        </div>
    );
};