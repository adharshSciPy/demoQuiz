import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarDatas } from './SliderData';
import { IconContext } from 'react-icons';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import '../assets/css/adminPage.css';
import Quiz from './Quiz';


function StudentPage() {
  const [sidebar, setSidebar] = useState(false);

  const toggleSidebar = () => setSidebar(!sidebar);

  return (
    <IconContext.Provider value={{ color: "white", size: "20px" }}>
      <div className='main'>
        {/* Nav start */}
        <nav className="custom-navbar">
          <div className="navbar-container">
            {/* Toggle between FaBars and AiOutlineClose */}
            <div className="menu-bar">
              {sidebar ? (
                <AiIcons.AiOutlineClose onClick={toggleSidebar} />
              ) : (
                <FaIcons.FaBars onClick={toggleSidebar} />
              )}
            </div>
            <h1>EDU-App Student</h1>
            <ul className="nav-links">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/logout">Logout</Link></li>
            </ul>
          </div>
        </nav>
        {/* Nav end */}

        {/* Sidebar start */}
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className="nav-menu-items" onClick={toggleSidebar}>
            {SidebarDatas.map((item, index) => (
              <li key={index} className={item.cName}>
                <Link to={item.path} onClick={toggleSidebar}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Sidebar end */}
            <Quiz/>
      </div>
    </IconContext.Provider>
  );
}

export default StudentPage;
