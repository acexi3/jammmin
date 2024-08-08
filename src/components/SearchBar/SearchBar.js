import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-js';

export default function SearchBar(props) {

    const spotifyApi = new SpotifyWebApi();
    const [searchInput, setSearchInput] = useState([""]);
    
    //Search for song title and return id, name, artists to display to user 
        const search = () => {
        spotifyApi.searchTracks("q: " + searchInput)
            .then(response => {
                console.log("Raw response : ", response);
                props.onSearch(response.tracks.items);
            })};
    
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