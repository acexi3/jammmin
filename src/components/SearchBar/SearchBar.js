import React, { useState } from 'react';
import { Container, InputGroup, FormControl, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

export default function SearchBar({ onSearch, isAuthenticated }) {
  const [searchInput, setSearchInput] = useState('');
  const [showError, setShowError] = useState(false);

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const search = async () => {
    setShowError(false);

    if (!isAuthenticated) {
      setShowError(true);
      onSearch([]);
      return;
    }

    try {
      const response = await axios.get(`${apiBaseUrl}/search?q=${encodeURIComponent(searchInput)}`, {
        withCredentials: true
      });
      
      if (response.data.tracks && response.data.tracks.items) {
        const processedTracks = response.data.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          albumArt: track.album.images[0]?.url,
          previewUrl: track.preview_url,
          uri: track.uri
        }));
        onSearch(processedTracks);
        setSearchInput(''); 
      } else {
        console.error("No data found in response or unexpected data structure:", response.data);
        onSearch([]);
      }
    } catch (error) {
      console.error("Error searching tracks:", error);
      onSearch([]);
    }
  };

// ======================================================================================
// Render
// ======================================================================================

    return (
        <div className="SearchBar">
          <Container>
            {showError && (
              <Alert variant="warning" onClose={() => setShowError(false)} dismissible>
                Please connect to Spotify before searching for tracks.
              </Alert>
            )}
            <InputGroup className="mb-3" size="lg">
                <FormControl
                    id="search-input"
                    type="input"
                    value={searchInput} 
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
