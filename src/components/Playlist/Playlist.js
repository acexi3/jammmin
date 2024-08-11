import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-js';

export default function SearchBar(props) {

    const spotifyApi = new SpotifyWebApi();
    const [playListName, setPlaylistName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [trackURIs, setTrackURIs] = useState([]);

    //Create a new playlist 
/*        const createPlaylist = () => {
            spotifyApi.createPlaylist("q: " + searchInput)
                .then(response => {
                    console.log("Raw response : ", response);
                    props.onSearch(response.tracks.items);
                })};
*/        
            const returnedToken = localStorage.getItem("accessToken");
};