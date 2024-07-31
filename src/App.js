import React from 'react';
import logo from './logo.svg';
//import './App.css';
import NavBar from './components/NavBar/NavBar';
import Hero from './components/Hero/Hero';

function App() {
  return (
  <>
    <div className="App">
      {/*<img src={logo} className="App-logo" alt="logo" />*/}
      <NavBar />
      <Hero />
    </div>
  </>
  );
}

export default App;
