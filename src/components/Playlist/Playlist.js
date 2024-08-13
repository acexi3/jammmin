import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

export default function Playlist() {

    const [playlistName, setPlaylistName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [trackURIs, setTrackURIs] = useState([]);

    // Create a new playlist 
    const createPlaylist = async () => {
        try {
            // Get User ID
            const user = await spotifyApi.getMe();
            const userId = user.id;

            // Create the playlist
            const playlist = await spotifyApi.createPlaylist(userId, {
                name: playlistName,
                description: description,
                public: isPublic
            });

            // Add tracks to the playlist, if any

            if (trackURIs.length > 0) {
                await spotifyApi.addTracksToPlaylist(playlist.id, trackURIs);
            }

            alert(`Playlist created successfully! Playlist ID: ${playlist.id}`);
        } catch (error) {
            console.error('Error creating playlist:', error);
            alert('failed to create playlist.');
            }
    };

    return (
        
        <div className="CreatePlaylist">
        <Container>
        <InputGroup className="create-playlist" size="lg">
            <FormControl
                id="playlist-name"
                type="input"
                value={playlistName}
                onChange={(event) => {
                    setPlaylistName(event.target.value)
                }}
                placeholder="Playlist Name"
                width="200px"
            />
            <FormControl
                id="playlist-description"
                type="input"
                value={description}
                onChange={(event) => {
                    setDescription(event.target.value)
                }}
                placeholder="Playlist Description"
                width="200px"
            />
            <FormControl
                label="Public:"
                id="public-private"
                type="checkbox"
                checked={isPublic}
                onChange={(event) => setIsPublic(event.target.checked)}
            /> 
            <FormControl
                type="input"
                placeholder="Track URIs (comma-separated)"
                value={trackURIs.join(',')}
                onChange={(event) => setTrackURIs(event.target.value.split(','))}
            />
            <Button onClick={{createPlaylist}}>Create Playlist</Button>  
        </InputGroup>
        </Container>
        </div>
    );
};
        /*
        <div>
        <h2>Create Your New Playlist</h2><br/>
        <input
          type="text"
          placeholder="Playlist Name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        /><br/><br/>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label>
            Public:
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </label>
        </div><br/>
        <input
          type="text"
          placeholder="Track URIs (comma-separated)"
          value={trackURIs.join(',')}
          onChange={(e) => setTrackURIs(e.target.value.split(','))}
        />
        <button onClick={createPlaylist}>Create Playlist</button>
      </div>
    );
};*/