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
  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/check-auth', { withCredentials: true });
      setIsAuthenticated(response.data.isAuthenticated);
      onAuthChange(response.data.isAuthenticated);
      if (response.data.accessToken) {
        onAccessTokenChange(response.data.accessToken);
      }
      if (response.data.refreshToken) {
        onRefreshTokenChange(response.data.refreshToken);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onAuthChange, onAccessTokenChange, onRefreshTokenChange, setIsAuthenticated, setIsLoading]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

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