import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import logo from './logo.svg';
//import './App.css';
import NavBar from './components/NavBar/NavBar';
import Hero from './components/Hero/Hero';
import Home from './pages/Home';
import Profile from './pages/Profile';


function App() {
  return (  
    
      <Router>
        <Routes>
          <Route path="/profile" element={<Profile/>} />  
          <Route index element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/" />
        </Routes>
      </Router>
  );
}

export default App;
