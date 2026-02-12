// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    // <div className="d-flex flex-column vh-100 p-3 bg-black" style={{ width: '250px' }}>
    <div className="vh-100 bg-light" style={{ width: '1000px' }}>
      <h3>Dashboard</h3>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/Room" className="nav-link">Room</Link>
        </li>
        <li className="nav-item">
          <Link to="/staff" className="nav-link">staff</Link>
        </li>
        <li className="nav-item">
          <Link to="/Payment" className="nav-link">Payment</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
