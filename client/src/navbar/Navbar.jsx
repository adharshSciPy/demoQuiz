import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../features/slice/authSlice";
import Logo from "../assets/img/Logo.png";
import "./navbar.css";
import adminAvatar from "../assets/img/admin-removebg-preview.png";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space } from "antd";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(setLogout());
    localStorage.removeItem("token");
    navigate("/");
  };
  const { loggedInUserId } = useAuth();
    
  const profileHandle= async(e)=>{
    navigate("/viewProfile")
    
  }
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-header">
          <img
            src={Logo}
            width={100}
            alt="logo"
            onClick={() => setDrawerOpen(!drawerOpen)}
          />
          <div className="profileButton">
            <Space wrap size={16}>
              <Avatar size={54} icon={<UserOutlined onClick={profileHandle}/>} />
            </Space>
          </div>
        </div>

        <div className={`drawer ${drawerOpen ? "open" : ""}`}>
          <div className="mainLogoDiv">
            <img width={100} src={Logo} alt="Insight Logo" />
          </div>
          <hr />
          <div className="drawer-header">
            <img
              className="adminAvatarImg"
              src={adminAvatar}
              alt="Admin Avatar"
            />
          </div>
          <ul>
            <li>
              <NavLink
                to="/admindashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setDrawerOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/session"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setDrawerOpen(false)}
              >
                Session
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/report"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setDrawerOpen(false)}
              >
                Report
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/edit"
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setDrawerOpen(false)}
              >
                Edit
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
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
            <p className="copyRight">
              Copyright © 2024 SciPy Technologies. All rights reserved
            </p>
          </div>
        </div>
        {drawerOpen && (
          <div className="backdrop" onClick={() => setDrawerOpen(false)}></div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
