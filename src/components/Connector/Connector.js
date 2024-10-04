import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import './Connector.css';

const CLIENT_ID = '06a0796f96084b688f70432ded3692e0';
const REDIRECT_URI = 'http://localhost:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code';
const SCOPES = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';
  
export default function Connector() {   
    const [accessToken, setAccessToken] = useState(null);

    // useEffect handles the callback from Spotify after successful login and exchanges the authorization code for an access token.
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search); // Creates URLSearchParams object from the URL's query string.
        const code = urlParams.get('code'); // Retrieves the 'code' parameter from the URL.
        
        if (code) {
            exchangeCodeForToken(code); // If code now exists, exchanges the authorization code for an access token.
        }
    }, []);
    
    // This function is used to generate a code challenge for the Spotify login process.
    // Using the PKCE (Proof Key for Code Exchange) method to securely authenticate the user.
    // Generates a random string and encodes it using SHA-256 to create a code challenge, which is used to verify the authenticity of the login process.
    // The code verifier is stored locally to be sent later to Spotify to verify the app requesting the token is the same as the one that started the process.
    const generateCodeChallenge = async () => {
        const codeVerifier = generateRandomString(128);
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        const base64Digest = btoa(String.fromCharCode.apply(null, new Uint8Array(digest)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        return { codeVerifier, codeChallenge: base64Digest };
    };

    // This function is used to handle the login process.
    const handleLogin = async () => {
        const { codeVerifier, codeChallenge } = await generateCodeChallenge();
        localStorage.setItem('codeVerifier', codeVerifier);

        const authUrl = new URL(AUTH_ENDPOINT);
        const params = {
            client_id: CLIENT_ID,
            response_type: RESPONSE_TYPE,
            redirect_uri: REDIRECT_URI,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            scope: SCOPES
        };

        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    };

    const exchangeCodeForToken = async (code) => {
        const codeVerifier = localStorage.getItem('codeVerifier');

        try {
            const response = await axios.post('https://accounts.spotify.com/api/token', {
                client_id: CLIENT_ID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                code_verifier: codeVerifier
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            // Here you would typically store the token securely and set up a refresh mechanism
            setAccessToken(response.data.access_token); 
        } catch (error) {
            console.error('Error exchanging code for token:', error); // Handle error appropriately
        }
    };

    // Kept for compatibility, but now used in generateCodeChallenge
    function generateRandomString(length) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
    }

    return (
        <div className="Connector">
            {!accessToken ? (
                <Button onClick={handleLogin}>Connect Me to My Spotify</Button>
            ) : (
                <p>You are Connected to Your Spotify</p>
            )}            
        </div>
    );
}