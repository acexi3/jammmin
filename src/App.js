import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import Home from './pages/Home';
import Profile from './pages/Profile';


function App() {
  return (  
    
      <Router>
        <Routes>
          <Route path="/profile" element={<Profile/>} />  
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;