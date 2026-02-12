// Header.js
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <a href="/">Hotel Management</a>
      </div>
      <nav className="navbar-links">
        <a href="/">Home</a>
        <a href="/rooms">Rooms</a>
        <a href="/services">Services</a>
        <a href="/about">About Us</a>
      </nav>
      <div className="navbar-profile">
        <div className="profile-info">
          <img
            src="https://via.placeholder.com/40" // Placeholder for profile picture
            alt="Profile"
            className="profile-pic"
          />
          <span>Admin</span>
        </div>
        <div className="dropdown-menu">
          <a href="/profile">Profile</a>
          <a href="/settings">Settings</a>
          <a href="/logout">Logout</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
