import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
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
    AUTH_URL += '?response_type=code';
    AUTH_URL += '&client_id=' + encodeURIComponent(CLIENT_ID);
    AUTH_URL += '&scope=' + encodeURIComponent(SCOPES);
    AUTH_URL += '&redirect_uri=' + encodeURIComponent(REDIRECT_AFTER_LOGIN);
    AUTH_URL += '&state=' + encodeURIComponent(STATE);

    console.log(AUTH_URL);

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
        <>
        <div className="Connector">
            {console.log("send off to Spotify login page invoked.")}
            <Button onClick={() => window.open(AUTH_URL, '_blank') }>Connect Me to My Spotify</Button>
        </div>
        </>
    );
}



// ======================================================================================
// Rewrite of Connector component using OAuth2
/* 

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import './Connector.css';

const CLIENT_ID = '06a0796f96084b688f70432ded3692e0';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code';
const SCOPES = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';

function Connector() {
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            exchangeCodeForToken(code);
        }
    }, []);

    const generateCodeVerifier = (length) => {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    const generateCodeChallenge = async (codeVerifier) => {
        const data = new TextEncoder().encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    const handleLogin = async () => {
        const codeVerifier = generateCodeVerifier(128);
        const codeChallenge = await generateCodeChallenge(codeVerifier);
    
        localStorage.setItem('code_verifier', codeVerifier);
    
        const authUrl = new URL(AUTH_ENDPOINT);
        const params = {
            client_id: CLIENT_ID,
            response_type: RESPONSE_TYPE,
            redirect_uri: REDIRECT_URI,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            scope: SCOPES,
        };
    
        authUrl.search = new URLSearchParams(params).toString();
        window.location = authUrl.toString();
    }

    const exchangeCodeForToken = async (code) => {
        const codeVerifier = localStorage.getItem('code_verifier');
    
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                code_verifier: codeVerifier,
            }),
        });
    
        const data = await response.json();
        if (response.ok) {
            setAccessToken(data.access_token);
            // Here you would typically store the token securely and set up a refresh mechanism
        } else {
            console.error('Error exchanging code for token', data);
            // Handle error (e.g., show error message to user)
        }
    }

    return (
        <div className="Connector">
            {!accessToken ? (
                <Button onClick={handleLogin}>Connect to Spotify</Button>
            ) : (
                <p>Connected to Spotify</p>
            )}
        </div>
    );
}

export default Connector;

*/