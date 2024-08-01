import React from 'react';
import './Connector.css';

function generateRandomString(length) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
 
    for (let i = 0; i < length; i++) {
       const randomIndex = Math.floor(Math.random() * charset.length);
       result += charset[randomIndex];
    }
    return result;
 };

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
console.log(localStorage.stateKey.value);

export default function Connector() {   
    
    const handleLogin = () => {
        window.location = AUTH_URL;
    };

    return (
        <div className="Connector">
            <h1>Connect me to my Spotify!</h1>
            <button onClick={handleLogin}>LOGIN</button>
        </div>
    );
};
