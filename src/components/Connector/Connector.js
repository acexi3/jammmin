import React, { useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import './Connector.css';

export default function Connector({ 
  onAuthChange, 
  onAccessTokenChange, 
  onRefreshTokenChange,
  isAuthenticated,
  setIsAuthenticated,
  isLoading,
  setIsLoading,
}) {
  console.log('Status of setIsAuthenticated in Connector:', setIsAuthenticated);
  
  // Callback Function to Check Authorization Status
  //***************************************************** */
  const checkAuthStatus = useCallback(async () => {
    try {
      console.log('Checking auth status...');
      const response = await axios.get('http://localhost:3001/api/check-auth', { withCredentials: true });
      console.log('Auth status response:', response.data);
      setIsAuthenticated(response.data.isAuthenticated);
      onAuthChange(response.data.isAuthenticated);
      if (response.data.accessToken) {
        onAccessTokenChange(response.data.accessToken);
        console.log('Access token received');
      }
      if (response.data.refreshToken) {
        onRefreshTokenChange(response.data.refreshToken);
        console.log('Refresh token received');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onAuthChange, onAccessTokenChange, onRefreshTokenChange, setIsAuthenticated, setIsLoading]);

  useEffect(() => {
    console.log('Connector useEffect running');
    checkAuthStatus();
  }, [checkAuthStatus]);

  // useEffect - API call for exchanging code to receive auth tokens 
  //*************************************************************** */

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
  
    const exchangeCodeForTokens = async () => {
      try {
        console.log('Code found in URL:', code);
        const response = await axios.get(`http://localhost:3001/api/callback?code=${code}`, { withCredentials: true });
        console.log('Token exchange response:', response.data);
        if (response.data.success) {
          await checkAuthStatus();
          // Clear the code from the URL to prevent multiple exchange attempts
          window.history.replaceState({}, document.title, "/");
        } else {
          throw new Error('Token exchange failed');
        }
      } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    if (code && !isAuthenticated) {
      exchangeCodeForTokens();
    } else if (!isAuthenticated) {
      checkAuthStatus();
    }
  }, [checkAuthStatus, isAuthenticated, setIsLoading]);

// handleLogin and hanlelogOut functions
// ************************************************************************************** */  

  const handleLogin = () => {
    console.log('Login button clicked in Connector');
    window.location.href = 'http://localhost:3001/api/login';
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      onAuthChange(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }


// Return the login/logout button render
// ************************************************************************************** */  
  return (
    <div className="Connector">
      {isAuthenticated ? (
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