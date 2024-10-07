import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';

export default function SearchBar({ accessToken, onSearch}) {
    
    const [searchInput, setSearchInput] = useState(['']);
    
    // This async function retrieves the access token from local storage and then 
    // searches for song title or artist and returns image, id, name, and artists to display to user 
    const search = async () => {
        
        console.log("Starting search with Access Token...", accessToken);

        if (!accessToken) {
            console.error("No access token available for search");  
            return;
        }
                        
        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track&limit=40`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            // Check if the response is OK 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);    
            }

            const data = await response.json();
            console.log("Raw response : ", data);
            
            if (data.tracks && data.tracks.items) {
                const processedTracks = data.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    albumArt: track.album.images[0]?.url,
                    previewUrl: track.preview_url,
                    uri: track.uri
                }));
                onSearch(processedTracks);
            } else {
                console.error("No data found in response or unexpected data structure:", data);
                onSearch([]);  // Pass an empty array if no results are found
            }
        } catch (error) {
            console.error("Error searching tracks:", error);
            if (error.response) {
                console.error("Error response:", await error.response.text());
            }
            onSearch([]);  // Pass an empty array in case of error
        }
    };

    // ======================================================================================
    // Render
    // ======================================================================================

    return (
        <div className="SearchBar">
          <Container>
            <InputGroup className="mb-3" size="lg">
                <FormControl
                    id="search-input"
                    type="input"
                    onKeyDown={(event) => { 
                        if (event.key === "Enter") { 
                            event.target.value = "";
                            search(); 
                    }}}
                    onChange={(event) => {setSearchInput(event.target.value.toLowerCase())}}
                    placeholder="What song(s) and/or artist(s) are you looking for?"
                    width="200px"
                />
                <Button onClick={search}>
                    Search
                </Button>  
            </InputGroup>
          </Container>
        </div>
    );
};