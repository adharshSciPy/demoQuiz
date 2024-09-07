import React from 'react';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import '../assets/css/adminPage.css';
import Quiz from './Quiz';
import NavbarStudent from '../navbar/NavbarStudent';


function StudentPage() {


  return (
    
      <div className='main'>
            <NavbarStudent/>
            <Quiz/>
            <Footer/>
      </div>
   
  );
}

export default StudentPage;
