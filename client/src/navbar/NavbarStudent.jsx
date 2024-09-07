import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./navbar.css"

function NavbarStudent() {
    const [menuOpen,setmenuOpen]=useState(false);
  return (
    <div>
        <nav>
        <Link to='#' className='title'>eduapp</Link>
        <div className="menubar" onClick={()=>{setmenuOpen(!menuOpen)}}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuOpen ? "open":" "}>
          <li><NavLink to='/studentdashboard'>Home</NavLink></li>
          
          
        </ul>
      </nav>
    </div>
  )
}

export default NavbarStudent
