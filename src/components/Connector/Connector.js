import React, { useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import './Connector.css';

export default function Connector({ 
  onAuthChange, 
  isAuthenticated,
  setIsAuthenticated,
  isLoading,
  setIsLoading,
}) {
    useEffect(() => {
      const checkAuthStatus = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/check-auth', { withCredentials: true });
          console.log('Auth status response:', response.data);
          setIsAuthenticated(response.data.isAuthenticated);
          onAuthChange(response.data.isAuthenticated);
        } catch (error) {
          console.error('Error checking auth status:', error);
        } finally {
          setIsLoading(false);
        }
      };

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        console.log('Authorization code found:', code);
        // Exchange the code for tokens
        const exchangeCode = async () => {
          try {
            const response = await axios.get(`http://localhost:3001/api/callback?code=${code}`, { withCredentials: true });
            console.log('Token exchange response:', response.data);
            checkAuthStatus();
          } catch (error) {
            console.error('Error exchanging code for tokens:', error);
          }
        };
        exchangeCode();
        // Clear the code from the URL
        window.history.replaceState({}, document.title, "/");
      } else {
        checkAuthStatus();
      }
    }, [onAuthChange, setIsAuthenticated, setIsLoading]);

  const handleLogin = () => {
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
