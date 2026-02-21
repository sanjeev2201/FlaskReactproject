import React, { useState } from "react";
import './sidebar.css'
import { 
  FaBars, 
  FaHome, 
  FaUser, 
  FaProjectDiagram, 
  FaTasks, 
  FaSignOutAlt 
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const role = localStorage.getItem("role");
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="top-section">
        <h2 className="logo">{collapsed ? "JR" : "JiraClone"}</h2>
        <FaBars 
          className="toggle-btn" 
          onClick={() => setCollapsed(!collapsed)} 
        />
      </div>

      <nav>
        <ul>
          <li>
            <NavLink to="/" className="nav-link">
             <FaHome />
            <span >Dashboard</span>
            </NavLink>
           
          </li>

      {role === "Admin" && (
        <>
         
          <li>
             <NavLink to="/organization" className="nav-link">
              <FaProjectDiagram />
                <span>Organization</span>
             </NavLink>
           
          </li>
          <li>
             <NavLink to="/Role" className="nav-link">
              <FaTasks />
                <span>Role</span>
             </NavLink>
          </li>
         
           {/* #....................................................# */}


          <li>
             <NavLink to="/profile" className="nav-link">
              <FaUser />
            <span>Profile</span>
             </NavLink>
           
          </li>
         </>)}
        </ul>
      </nav>

      <div className="bottom-section">
        <NavLink to="/Logout" className="nav-link">
        <FaSignOutAlt />
        <span>Logout</span>
        </NavLink>
        
      </div>
    </div>
  );
}
