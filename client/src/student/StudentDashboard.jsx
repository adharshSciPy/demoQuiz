import React from 'react';
// import {styles } from '../assets/css/studentDashboard.module.css';
import NavbarStudent from '../navbar/NavbarStudent';
import AttentedSession from './AttentedSession';



function StudentDashboard() {
  return (
    <div>
      <NavbarStudent />
       
      <AttentedSession/>
    </div>
  )
}

export default StudentDashboard
