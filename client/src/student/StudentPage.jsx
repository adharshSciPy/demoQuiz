import React from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import '../assets/css/adminPage.css';
import Quiz from './Quiz';


function StudentPage() {


  return (
    
      <div className='main'>
            <Navbar/>
            <Quiz/>
            <Footer/>
      </div>
   
  );
}

export default StudentPage;
