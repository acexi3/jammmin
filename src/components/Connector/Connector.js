import React, { useEffect } from 'react';
import './Connector.css';

// This module is rendered as a button to
// 1. Connect to Spotify for user authentication
// 2. Return a token to allow API access and action to user playlists
// 3. Stores the token in local storage

// Generate a state variable for security purposees, using a random string generator

function generateRandomString(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
 
    for (let i = 0; i < length; i++) {
       const randomIndex = Math.floor(Math.random() * charset.length);
       result += charset[randomIndex];
    }
    return result;
 };

// Pops up user login access to Spotify in order to connect by client ID and return a verification token
// 1. Using a client ID from the Spotify web app in my Spotify dev profile
// 2. Creating the STATE using the random string generator function, above
// 3. creating a stateKey to match with the generated STATE and storing it in local browser storage
//    This STATE prevents CROSS SITE REQUEST FORGERY (CSRF) attacks
// 4. Ading Scopes, to define what the user can do with the Spotify API connection
// 5. Constructing the above into an authorization URL

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

// Getting the token value from Spotify through the returned URL, using URL API from the browser DOM
// example - http://localhost:3000/#access_token=BQArAY-2FL_kAxPSM6nu3uAIKu65iYWz8reCx29I-APiFBLr-Ix1qskujrSnhiSoMcvnJr9Lunuy-EJidRRoyGKt0du4HUl-F_w2xQqcOyt97sCUzWhsUcVhf6jnVnctPISaByEcVlJcov0MMzeB32pZG1U0SRaU3D2hCp98lqEvnGj5kKXtwKmSHkILi93oUQIpVVfIAhkzW1tYaNzdXBHLpgQGLDmONAGzPUcpB07EFmRKPw7Wcg_BnYBDw4MHCQBu6KNXBo_-cQ&token_type=Bearer&expires_in=3600&state=BMolC0DgMqI3zk4V

// 1. Passing in the window.location.href - i.e. url - to the function
// 2. Constructing a url object using the same href url
// 3. Turning that object into an array of strings, taking the hash string from the url, 
//    creating a substring starting at index 1 (to drop the # symbol), and splitting it at the '&'s
// 4. Using the reduce iterator function to turn the array into an object of key: value pairs

    const getReturnedParamFromSpotifyAuth = (href) => {           
        const url = new URL(href);                                   
        const queryParams = url.hash.substring(1).split('&');       
        const paramsSplitUp = queryParams.reduce((accumulator, currentValue) => { 
            const [key, value] = currentValue.split("="); 
            accumulator[key] = value; 
            return accumulator; 
        }, {}); 
        
        return paramsSplitUp; 
    }; 
    
    export default function Connector() {   
    
        // 1. Checks if there's a URL in the browser's address bar.
        // 2. If so, extracts the access token and expiration time using destructuring.
        // 3. Clears local storage and sets new key-value pairs.
        // 4. Renders a button that redirects the user to the Spotify authorization page.

        useEffect(() => {
            if (window.location.href) {
                const { access_token, 
                        expires_in, 
                    } = getReturnedParamFromSpotifyAuth(window.location.href);

                console.log({ access_token, expires_in });

                localStorage.clear();
                localStorage.setItem("accessToken", access_token);
                localStorage.setItem("expiresIn", expires_in);
            }
        });
        
        return (
            <div className="Connector">
                <button onClick={() => window.location.href = AUTH_URL }>Connect me to my Spotify!</button>
            </div>
        );
};