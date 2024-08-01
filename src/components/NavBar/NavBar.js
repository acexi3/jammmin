import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
    return (
      <header className="NavBar">
        <nav>
          <ul>
            <Link to="/">
              <li>Home</li>
            </Link>
            <Link to="profile">
              <li>Profile</li>
            </Link>
          </ul>
        </nav>
      </header>
    );
};