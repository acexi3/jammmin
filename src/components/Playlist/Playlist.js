import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Playlist.css';

export default function Playlist({ selectedTracks }) {

  // Display the selected tracks for the Playlist   
  return (
    <div className="SonglistContainer">
      
      {selectedTracks.length > 0 && <h3 className="PlaylistHeader">Selected for Your Playlist</h3>}
      
        {/*Scrollable container for Selected Songs*/}
        <div className="PlaylistSongs">
        <ul>
          {selectedTracks.map((track, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={track.albumArt}
                alt={`${track.name} album art`}
                style={{ width: '70px', height: '70px', marginRight: '8px', padding: '2px' }}
              />
              {track.name} - {track.artist}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}