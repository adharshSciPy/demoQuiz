import React, { useState } from 'react';
import '../assets/css/landing.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate(); // Hook for navigation

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    try {
      const response = await axios.post('http://localhost:8000/api/v1/user/register', form);
      console.log(response);
      if (response.status === 200) {
        // Navigate to login page after successful signup
        navigate('/');
      }
    } catch (error) {
      alert(error);
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
      <div className='container'>
        <div className='dashboard'>
          <div className='button'>
            <form className="landingForm" onSubmit={handleSignup}>
              <div className="name">
                <label htmlFor="name" className="label-name">Name</label>
                <input
                  className='input-name'
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder='Enter your Name'
                />
              </div>
              <div className="email">
                <label htmlFor="email" className="label-email">Email</label>
                <input
                  className='input-email'
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder='Enter your Email'
                />
              </div>
              <div className="password">
                <label htmlFor="password" className="label-password">Password</label>
                <input
                  className='input-password'
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                />
              </div>

              <div className="btn-div">
                <button type="submit" className="btn-submit">Sign Up</button>
              </div>

              <div className="signup-div">
                <p className='paragraph'>Already a Member?</p>
                <Link className='signup-link' to="/" >Log In</Link>
              </div>
            </form>
          </div>
          <div className='head'>
            <h1>Why Wait?</h1>
            <p>
              Create your account and unlock exclusive access to all of our features.
            </p>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="right-panel">
          Scipy Technologies
        </div>
      </footer>
    </div>
  );
}

export default SignUp;
