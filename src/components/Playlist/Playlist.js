import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Playlist({ selectedTracks }) {

  // Display the selected tracks for the Playlist   
  return (
    <div className="CreatePlaylist">

      <h3>Selected Tracks</h3>
      <ul>
        {selectedTracks.map((track, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={track.albumArt}
              alt={`${track.name} album art`}
              style={{ width: '50px', height: '50px', marginRight: '10px' }}
            />
            {track.name} - {track.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}