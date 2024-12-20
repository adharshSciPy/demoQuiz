import React from 'react';
import styles from '../assets/css/studentDashboard.module.css'
import NavbarStudent from '../navbar/NavbarStudent';
import AttentedSession from './AttentedSession';
import StDashboard from './Dashboard';



function StudentDashboard() {
  return (
    <div>
      <NavbarStudent />
      <div className={styles.contentsDiv}>
      <AttentedSession/>

       <StDashboard/>
      </div>
    </div>
  )
}

export default StudentDashboard
