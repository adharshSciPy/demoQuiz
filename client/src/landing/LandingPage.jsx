import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/landing.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Footer from '../footer/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function LandingPage() {
  let field = {
    email: "",
    password: ""
  };

  const [form, setForm] = useState(field);
  const [errorMessage, setErrorMessage] = useState(""); // State to track error message
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const notifyError = (message) => toast.error(message); // Pass dynamic error message

  const handleSignin = async (e) => {
    e.preventDefault(); // Prevent the form from submitting the traditional way
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/login`, form);
      console.log(response);

      // If login is successful, navigate to /studentdashboard
      if (response.status === 200) {
        navigate('/studentdashboard');
      }
      
    } catch (error) {
        // Set error message to display if login fails
        setErrorMessage(error.response?.data?.message || "Invalid email or password. Please try again.");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className='body'>
         <ToastContainer position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover />
      <div className='container'>
        <div className='dashboard'>
          <div className='button'>
            <form className="landingForm" onSubmit={handleSignin}>
              <div className="email">
                <label htmlFor="email" className="label-email">Email</label>
                <input
                  className='input-email'
                  type="email"
                  name="email"
                  placeholder='Enter your Email'
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="password">
                <label htmlFor="password" className="label-password">Password</label>
                <input
                  className='input-password'
                  type="password"
                  name="password"
                  placeholder='Enter your password'
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              
              {/* Show error message if there is one */}
              {errorMessage && (
                <div className="error-message" style={{ color: 'red', fontSize: '0.9rem', marginTop: '10px' }}>
                  {errorMessage}
                </div>
              )}
              
              <div className="btn-div">
                <button type="submit" className="btn-submit">Sign In</button>
              </div>
              <div className="signup-div">
                <p className='paragraph'>Create Your Account</p>
                <Link className='signup-link' to="/signup">Sign Up</Link>
              </div>
            </form>
          </div>
          <div className='head'>
            <h1>Welcome to Eduapp</h1>
            <p>Dive into a diverse world of quizzes with Eduapp. Whether you're a tech enthusiast or just love trivia, our app offers a rich blend of technical and non-technical questions to challenge and entertain you.</p>
          </div>
        </div>
      </div>
      <Footer />
     
    </div>
  );
}

export default LandingPage;
