import React, { useEffect, useState, useCallback, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import './Connector.css';

// ======================================================================================
// Spotify Credential Declarations
// ======================================================================================

const CLIENT_ID = '06a0796f96084b688f70432ded3692e0';
const REDIRECT_URI = 'http://localhost:3000';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code';
const SCOPES = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private';

// ======================================================================================
// Connector Component
// ======================================================================================

export default function Connector({
    accessToken,
    onAccessTokenChange,
    refreshToken,
    onRefreshTokenChange    
}) {   
    const [expiresAt, setExpiresAt] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const isExchangingCode = useRef(false);

    // This function is used to handle the response from the Spotify token endpoint.
    // Sets the access token, refresh token, and expiration time in the state and locally.  
    const handleTokenResponse = useCallback((data) => {
        console.log('Handling token response:', data);
        
        // Update access token and refresh token
        if (onAccessTokenChange) {
            onAccessTokenChange(data.access_token);
        }
        if (onRefreshTokenChange) {
            onRefreshTokenChange(data.refresh_token || refreshToken); // Use new refresh token if provided, otherwise keep the existing one
        }

        const expiresAt = Date.now() + data.expires_in * 1000;
        setExpiresAt(expiresAt);

        // Store tokens securely (consider using more secure storage in production)
        localStorage.setItem('spotifyAccessToken', data.access_token);
        localStorage.setItem('spotifyRefreshToken', data.refresh_token || refreshToken);
        localStorage.setItem('spotifyExpiresAt', expiresAt.toString());

        setIsLoading(false);
        setError(null);

        // Remove the code parameter from the URL
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
    }, [refreshToken, onAccessTokenChange, onRefreshTokenChange]);  // Use refreshToken in the dependency array to ensure the function is recreated if refreshToken changes.

    // This async function is used to exchange the authorization code for an access token.
    // Retrieves the code verifier from local storage and constructs the request body with the necessary parameters.
    // Sends a POST request to the Spotify token endpoint to exchange the code for an access token.
    // Sets the access token in the state and stores it locally.
    const exchangeCodeForToken = useCallback(async (code) => {
        
        console.log('Starting token exchange process...');
        const codeVerifier = localStorage.getItem('codeVerifier');
        console.log('Code Verifier used for token exchange:', codeVerifier);

        if (!codeVerifier) {
            console.error('No code verifier found in local storage');
            setError('Authentication failed. Please try again.');
            //setIsLoading(false);
            return;
        }

        try {
            console.log('Sending token exchange request to Spotify...');
            const response = await axios.post('https://accounts.spotify.com/api/token', 
                new URLSearchParams({
                client_id: CLIENT_ID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                code_verifier: codeVerifier
            }).toString(), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            // Here you would typically store the token securely and set up a refresh mechanism
            console.log("Token exchange successful:", response.data);
            handleTokenResponse(response.data); 
            setError(null); // Clear any previous errors
        } catch (error) {
            console.error('Error exchanging code for token:', error); // Handle error appropriately
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                console.error('Error request:', error.request);
            } else {
                console.error('Error message:', error.message);
            }
            setError('Failed to connect to Spotify. Please try again.');
            onAccessTokenChange(null);
            onRefreshTokenChange(null);
            setExpiresAt(null);
        } finally {
            //setIsLoading(false);
            localStorage.removeItem('codeVerifier'); // Clear code verifier after use
        }
    }, [ handleTokenResponse, onAccessTokenChange, onRefreshTokenChange ]); // Include handleTokenResponse in the dependency array to ensure the function is recreated if handleTokenResponse changes.
 
    // This async function is used to refresh the access token.
    // Retrieves the refresh token from local storage and constructs the request body with the necessary parameters.
    // Sends a POST request to the Spotify token endpoint to refresh the access token.
    // Sets the new access token in the state and stores it locally.
    const refreshAccessToken = useCallback(async () => {
        try {
            const response = await axios.post('https://accounts.spotify.com/api/token',
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: CLIENT_ID,
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            console.log('Token refresh successful:', response.data);
            handleTokenResponse(response.data);
        } catch (error) {
            console.error('Error refreshing token:', error.response ? error.response.data : error.message);
            setError('Failed to refresh Spotify connection. Please reconnect.');
            // Optionally, you could trigger a new login here
        }
    }, [ refreshToken, handleTokenResponse ]); // Include refreshToken and handleTokenResponse in the dependency array to ensure the function is recreated if refreshToken changes.

    // ======================================================================================
    // Hooks
    // ======================================================================================

    // useEffect handles the callback from Spotify after successful login and exchanges the authorization code for an access token.
    useEffect(() => {
        const checkAuthStatus = async () => {
            console.log('Checking authentication status...');
            if (isExchangingCode.current) {
                console.log('Already exchanging code for tokens, skipping check...');
                return; 
            }
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            
            if (code && !accessToken && !isExchangingCode.current) {
                console.log('Received new code from Spotify, initiating token exchange...');
                isExchangingCode.current = true;
                setIsLoading(true);
                //exchangeCodeForToken(code);
                try {
                    await exchangeCodeForToken(code);
                } finally {
                    isExchangingCode.current = false;
                    setIsLoading(false);
                }
            } else if (accessToken) {
                console.log('Access token already exists, skipping token exchange...');
            } else {
                console.log('No code received from Spotify, checking localStorage...');
                const storedAccessToken = localStorage.getItem('spotifyAccessToken');
                const storedRefreshToken = localStorage.getItem('spotifyRefreshToken');
                const storedExpiresAt = localStorage.getItem('spotifyExpiresAt');
    
                if (storedAccessToken && storedRefreshToken && storedExpiresAt) {
                    const now = Date.now();
                    if (now < parseInt(storedExpiresAt)) {
                        // Token is still valid
                        console.log('Restored valid token from storage');
                        onAccessTokenChange(storedAccessToken);
                        onRefreshTokenChange(storedRefreshToken);
                        setExpiresAt(parseInt(storedExpiresAt));
                    } else {
                        // Token expired, clear storage and state
                        console.log('Stored token expired, clearing');
                        localStorage.removeItem('spotifyAccessToken');
                        localStorage.removeItem('spotifyRefreshToken');
                        localStorage.removeItem('spotifyExpiresAt');
                        onAccessTokenChange(null);
                        onRefreshTokenChange(null);
                        setExpiresAt(null);
                    }
                } else {
                    console.log('No stored tokens found');
                }
                setIsLoading(false);
            }
        };
    
        checkAuthStatus();
    }, [exchangeCodeForToken, onAccessTokenChange, onRefreshTokenChange, accessToken]); // Include exchangeCodeForToken in the dependency array to ensure the function is recreated if exchangeCodeForToken changes.

    // useEffect handles the refresh of the access token 5 minutes before it expires.
    useEffect(() => {
        if (accessToken && expiresAt) {
            const refreshInterval = setInterval(() => {
                if (Date.now() >= expiresAt - 300000) { // Refresh 5 minutes before expiration
                    refreshAccessToken();
                }
            }, 60000); // Check every minute

            return () => clearInterval(refreshInterval);
        }
    }, [accessToken, expiresAt, refreshAccessToken]);

    // For testing: useEffect is used to log the current state of the Connector component.
    useEffect(() => {
        console.log('Current state:', { accessToken, refreshToken, expiresAt, isLoading, error });
    }, [accessToken, refreshToken, expiresAt, isLoading, error]);

    // ======================================================================================
    // Utility Functions
    // ======================================================================================
   
    // This async function is used to handle the login process on button click
    // Calls code verifier function, stores it locally and constructs the auth URL with the necessary parameters.
    // It then redirects the user to the Spotify login page.
    const handleLogin = async () => {

        localStorage.removeItem('spotifyAccessToken');
        localStorage.removeItem('spotifyRefreshToken');
        localStorage.removeItem('spotifyExpiresAt');

        const { codeVerifier, codeChallenge } = await generateCodeChallenge();
        console.log('Code Verifier:', codeVerifier);
        console.log('Code Challenge:', codeChallenge);
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

    // This function is used to handle the logout process on button click
    // Clears the access token, refresh token, and expiration time from the state and locally.
    // Redirects the user to the home page.
    const handleLogout = () => {
        onAccessTokenChange(null);
        onRefreshTokenChange(null);
        setExpiresAt(null);
        localStorage.removeItem('spotifyAccessToken');
        localStorage.removeItem('spotifyRefreshToken');
        localStorage.removeItem('spotifyExpiresAt');
    };

    // This async function is used to generate a code challenge for the Spotify login process.
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

    // This function generates a random string of a given length.
    // Used in generateCodeChallenge to create a code verifier.
    function generateRandomString(length) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
    };

    // This function is used to check if the access token is valid.
    const isTokenValid = useCallback(() => {
        return accessToken && expiresAt && Date.now() < expiresAt;
    }, [accessToken, expiresAt]);

    // This function is used to render the Connector component.
    // If the access token does not exist, it displays a button to connect to Spotify.
    // If the access token exists, it displays a message indicating that the user is connected to Spotify.
    // Connector is rendered within the Hero section of the App.js file.
    return (
        
        <div className="Connector">
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <div>
                    <p>{error}</p>
                    <Button onClick={handleLogin}>Try Again</Button>
                </div>
            ) : isTokenValid() ? (
                <div>
                    <p>You are Connected to Your Spotify</p>
                    <Button onClick={handleLogout}>Disconnect</Button>
                </div>
            ) : (
                <Button onClick={handleLogin}>Connect Me to My Spotify</Button>
            )}
        </div>
    );
}