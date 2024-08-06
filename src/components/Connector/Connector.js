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
    AUTH_URL += '?response_type=token';
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
                <Button onClick={() => window.open(AUTH_URL, '_blank') }>Connect me to my Spotify!</Button>
            </div>
            <br></br>
            </>
        );
};