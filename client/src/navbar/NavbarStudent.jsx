import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogout } from '../features/slice/authSlice';
import Logo from '../assets/img/Logo.png';
import "./navbar.css";
import useAuth from '../hooks/useAuth';

import studentAvatar from '../assets/img/studentavatar-removebg-preview.png'; // Add student avatar image (optional)

function NavbarStudent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedInUserId, isLoggedIn } = useAuth();

  const handleLogout = () => {
    dispatch(setLogout()); // Dispatch the logout action
    localStorage.removeItem('token'); // Remove the token from local storage
    navigate('/'); // Redirect to the login page
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-header">
          <img
            src={Logo}
            width={100}
            alt="logo"
            onClick={() => setDrawerOpen(!drawerOpen)} // Toggle drawer on logo click
          />
        </div>

        {/* Drawer Menu */}
        <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
          <div className="mainLogoDiv">
            <img width={100} src={Logo} alt="Insight Logo" />
          </div>
          <hr />
          <div className="drawer-header">
            <img className="studentAvatarImg" src={studentAvatar} alt="Student Avatar" />
          </div>
          <ul>
            <li>
              <NavLink
                to={`/studenthomepage/${loggedInUserId}`}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setDrawerOpen(false)}
              >
                Home
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/instructions"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setDrawerOpen(false)}
              >
                Instructions
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/disqualified"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setDrawerOpen(false)}
              >
                Disqualified
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => {
                  handleLogout();
                  setDrawerOpen(false);
                }}
              >
                Logout
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/studentdashboard/${loggedInUserId}`}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => {
                  // handleLogout();
                  setDrawerOpen(false);
                }}
              >
                Start Quiz
              </NavLink>
            </li>
          </ul>
          <div className="drawerDiv">
            <p className="copyRight">Copyright © 2024 SciPy Technologies. All rights reserved</p>
          </div>
        </div>

        {/* Backdrop for closing drawer when clicked outside */}
        {drawerOpen && <div className="backdrop" onClick={() => setDrawerOpen(false)}></div>}
      </nav>
    </div>
  );
}

export default NavbarStudent;
