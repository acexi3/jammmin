import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';

export default function SearchBar({ accessToken, onSearch}) {
    // ======================================================================================
    // State Declaration - searchInput
    // ======================================================================================

    const [searchInput, setSearchInput] = useState(['']);
    
    // ======================================================================================
    // Functions
    // ======================================================================================

    // This async function retrieves the access token from local storage and then 
    // searches for song title or artist and returns image, id, name, and artists to display to user 
    const search = async () => {
        console.log("Access Token:", accessToken);  // Log the access token (be careful with this in production)
        console.log("Search Input:", searchInput);  // Log the search input
        
        if (!accessToken) {
            console.error("No access token available");
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track&limit=40`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });                                                 // &type=album%2Cartist%2Ctrack&limit=40&offset=0
            
            if (response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);    
            }

            const data = await response.json();
            console.log("Raw response : ", data);
            
            if (data.tracks && data.tracks.items) {
                onSearch(data.tracks.items);
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
                <Button onClick={() => {
                    search();
                    document.getElementById("search-input").value = "";
                }}>
                    Search
                </Button>  
            </InputGroup>
          </Container>
        </div>
    );
};