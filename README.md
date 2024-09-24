# Jammin Playlists - A Spotify Playlist Creator

This web application allows users to connect to their Spotify account, search for songs and/or artists, select songs from search results, and create a new playlist that can be saved directly to their Spotify account.

## Features

- **Spotify Authentication**: Users must log in with their Spotify account to use this app.
- **Search Songs/Artists**: Users can search the Spotify catalog by song title and/or artist name. More accurate results may occur when using both the song title and artist name in the search bar. You can also enter only the artist name to get multiple songs from that artist.
- **Add Songs to Playlist**: Users can select songs from the search results to create a custom playlist.
- **Save Playlist**: Once a playlist is created, users can name it and write a description and save it to their Spotify account.

## Prerequisites

To log on to your Spotify account and use the app in its current version, users must enter in developer mode.

- **Spotify Developer Account**: You will need to register the app and retrieve `Client ID` and `Redirect URI` from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).
- **Node.js**: Ensure that you have Node.js installed on your machine.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/spotify-playlist-creator.git
   cd spotify-playlist-creator
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and include your Spotify credentials:
   ```
   REACT_APP_SPOTIFY_CLIENT_ID=your-client-id
   REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000
   ```

4. Start the application:
   ```bash
   npm start
   ```

## Usage

1. Click the "Connect me to my Spotify" button to authenticate with Spotify.
2. Use the search bar to search for songs and/or artists.
3. Select songs from the search results to add them to the playlist.
4. Save the playlist to your Spotify account.

## Technologies Used

- **React**: Frontend framework.
- **Spotify Web API**: To interact with Spotify's song and playlist data.
- **React-Bootstrap**: For UI styling and layout.

## Notes

- The app currently uses the **Implicit Grant Flow** for authentication. In this flow, tokens are not automatically refreshed. Future enhancements may include switching to **Authorization Code Flow** for improved token management.

## License

This project is licensed under the MIT License. See the LICENSE file for details.