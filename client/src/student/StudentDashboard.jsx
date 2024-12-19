import React from 'react';

import NavbarStudent from '../navbar/NavbarStudent';
import AttentedSession from './AttentedSession';
import StDashboard from './Dashboard';



function StudentDashboard() {
  return (
    <div>
      <NavbarStudent />
       <StDashboard/>
      <AttentedSession/>
    </div>
  )
}

export default StudentDashboard
