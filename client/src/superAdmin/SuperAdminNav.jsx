import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogout } from '../features/slice/authSlice';
import Logo from '../assets/img/Logo.png';
import "../navbar/navbar.css";
import adminAvatar from '../assets/img/admin-removebg-preview.png';

function SuperAdminNav() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      dispatch(setLogout());
      localStorage.removeItem('token');
      navigate('/');
    };
  
    return (
      <div>
        <nav className="navbar">
          <div className="navbar-header">
            <img src={Logo} width={100} alt="logo" onClick={() => setDrawerOpen(!drawerOpen)} />
          </div>
  
          <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
            <div className="mainLogoDiv">
              <img width={100} src={Logo} alt="Insight Logo" />
            </div>
            <hr />
            <div className="drawer-header">
              <img className="adminAvatarImg" src={adminAvatar} alt="Admin Avatar" />
            </div>
            <ul>
              <li>
                <NavLink
                  to="/superadmindash"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setDrawerOpen(false)}
                >
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/adminregister"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setDrawerOpen(false)}
                >
                  Register Admin
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/userreport"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setDrawerOpen(false)}
                >
                  User Report
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/report"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setDrawerOpen(false)}
                >
                  Report
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
            </ul>
            <div className="drawerDiv">
              <p className="copyRight">Copyright © 2024 SciPy Technologies. All rights reserved</p>
            </div>
          </div>
          {drawerOpen && <div className="backdrop" onClick={() => setDrawerOpen(false)}></div>}
        </nav>
      </div>
    );
  }
  

export default SuperAdminNav
