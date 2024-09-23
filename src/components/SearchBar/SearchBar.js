import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-js';

export default function SearchBar(props) {

    const spotifyApi = new SpotifyWebApi();
    const [searchInput, setSearchInput] = useState([""]);
    
    //Search for song title and return image, id, name, artists to display to user 
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
                    id="search-input"
                    type="input"
                    onKeyDown={(event) => { 
                        if (event.key === "Enter") { 
                            spotifyApi.setAccessToken(returnedToken);
                            event.target.value = "";
                            search(); 
                    }}}
                    onChange={(event) => {
                        setSearchInput(event.target.value.toLowerCase())
                    }}
                    placeholder="What song(s) and/or artist(s) are you looking for?"
                    width="200px"
                />
                <Button onClick={() => { spotifyApi.setAccessToken(returnedToken);
                                            search();
                                            document.getElementById("search-input").value = "";}}>Search</Button>  
            </InputGroup>
          </Container>
        </div>
    );
};