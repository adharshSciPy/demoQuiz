import React from 'react'
import "../assets/css/style.css";
import Navbar from '../navbar/Navbar';


import ReportTable from './Table';


function Report() {
  return (
    <div className='main'>
        <Navbar/>
       
        <ReportTable/>
       
      
    </div>
  )
}

export default Report
