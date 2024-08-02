import React, { useEffect } from 'react';
import './Connector.css';

// Generate the token as a random string... but shouldn't this come from Spotify?

function generateRandomString(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
 
    for (let i = 0; i < length; i++) {
       const randomIndex = Math.floor(Math.random() * charset.length);
       result += charset[randomIndex];
    }
    return result;
 };

// Pops up user login for Spotify in order to access and manipulate playlists
// 1. using my client ID from the Spotify web app in my Spotify dev profile
// 2. create the STATE using the random string generator function above
// 3. creating a stateKey to match with the generated STATE and storing it in local browser storage
// 4. defining the scope of the connection to Spotify API -- defining what the user can do in the app
// 5. constructing the authorization URL


var CLIENT_ID = '06a0796f96084b688f70432ded3692e0';
var REDIRECT_AFTER_LOGIN = 'http://localhost:3000';
    
var STATE = generateRandomString(16);
var stateKey = 'spotify_state'; 
localStorage.setItem(stateKey, STATE);

var SCOPES = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';
    
var AUTH_URL = 'https://accounts.spotify.com/authorize';
    AUTH_URL += '?response_type=token';
    AUTH_URL += '&client_id=' + encodeURIComponent(CLIENT_ID);
    AUTH_URL += '&scope=' + encodeURIComponent(SCOPES);
    AUTH_URL += '&redirect_uri=' + encodeURIComponent(REDIRECT_AFTER_LOGIN);
    AUTH_URL += '&state=' + encodeURIComponent(STATE);

    console.log(AUTH_URL);

// Get the token value from the returned URL after the connection with Spotify API
// http://localhost:3000/#access_token=BQArAY-2FL_kAxPSM6nu3uAIKu65iYWz8reCx29I-APiFBLr-Ix1qskujrSnhiSoMcvnJr9Lunuy-EJidRRoyGKt0du4HUl-F_w2xQqcOyt97sCUzWhsUcVhf6jnVnctPISaByEcVlJcov0MMzeB32pZG1U0SRaU3D2hCp98lqEvnGj5kKXtwKmSHkILi93oUQIpVVfIAhkzW1tYaNzdXBHLpgQGLDmONAGzPUcpB07EFmRKPw7Wcg_BnYBDw4MHCQBu6KNXBo_-cQ&token_type=Bearer&expires_in=3600&state=BMolC0DgMqI3zk4V

    const getReturnedParamFromSpotifyAuth = (hash) => {
        const stringAfterHashtag = hash.substring(1);
        const paramsInUrl = stringAfterHashtag.split("&");
        const paramsSplitUp = paramsInUrl.reduce((accumulator, currentValue) => {
            console.log(currentValue);
            const [key, value] = currentValue.split("=");
            accumulator[key] = value;
            return accumulator;
        }, {});
        
        return paramsSplitUp;
    };

    export default function Connector() {   
    
        useEffect(() => {
            if (AUTH_URL) {
                const object = getReturnedParamFromSpotifyAuth(AUTH_URL);
                console.log({ object });
            }
        });
        
        const handleLogin = () => {
            window.location = AUTH_URL;
        };

        return (
            <div className="Connector">
                {/*<h1>Connect me to my Spotify!</h1>*/}
                <button onClick={handleLogin}>Connect me to my Spotify!</button>
            </div>
        );
};







