import React, { useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import './Connector.css';
import '../Hero/Hero.css';

export default function Connector({ 
  onAuthChange, 
  isAuthenticated,
  setIsAuthenticated,
  isLoading,
  setIsLoading,
}) {

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL; 

  useEffect(() => {
    console.log('Connector useEffect triggered');
    const checkAuthStatus = async () => {
      console.log('Checking auth status...');
      try {
        const response = await axios.get(`${apiBaseUrl}/check-auth`, { withCredentials: true });
        console.log('Auth status response:', response.data);
        setIsAuthenticated(response.data.isAuthenticated);
        onAuthChange(response.data.isAuthenticated);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }      
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      console.log('Authorization code found:', code);
      const exchangeCode = async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/callback?code=${code}`, { withCredentials: true });
          console.log('Token exchange response:', response.data);
          // After successful token exchange, clear the URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          // Check auth status after token exchange
          await checkAuthStatus();
        } catch (error) {
          console.error('Error exchanging code for tokens:', error);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      };
      exchangeCode();
    } else {
      checkAuthStatus();
    }
  }, [onAuthChange, setIsAuthenticated, setIsLoading, apiBaseUrl]);

  // Function: Handle Login, call to backend to redirect to Spotify login
  const handleLogin = () => {
    console.log('Login URL:', `${apiBaseUrl}/login`);
    window.location.href = `${apiBaseUrl}/login`;
  };

  // Function: Handle Logout, call to backend to clear cookies
  const handleLogout = async () => {
    try {
      await axios.post(`${apiBaseUrl}/logout`, {}, { withCredentials: true });
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
          <Button className="custom-button" onClick={handleLogout}>Disconnect</Button>
        </div>
      ) : (
        <Button  className="custom-button" onClick={handleLogin}>Connect Me to My Spotify</Button>
      )}
    </div>
  );
}
