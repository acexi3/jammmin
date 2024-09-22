import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Playlist({ selectedTracks }) {

  // Display the selected tracks for the Playlist   
  return (
    <div className="CreatePlaylist">
      {selectedTracks.length > 0 && <h3 className="PlaylistHeader">Selected Tracks</h3>}
      <ul>
        {selectedTracks.map((track, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={track.albumArt}
              alt={`${track.name} album art`}
              style={{ width: '70px', height: '70px', marginRight: '10px', padding: '2px' }}
            />
            {track.name} - {track.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}