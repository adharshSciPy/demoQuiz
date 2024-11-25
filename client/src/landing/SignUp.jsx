import React, { useState } from 'react';
import styles from '../assets/css/signup.module.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FilledInput from '@mui/material/FilledInput';
import Footer from '../footer/Footer';


function SignUp() {

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };




  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    batch: "",
    date: ""
  });

  const navigate = useNavigate(); // Hook for navigation

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    try {
      const response = await axios.post('http://localhost:8000/api/v1/user/register', form);
      console.log(response);
      if (response) {
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
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.dashboard}>
          <div className={styles.button}>
            <form className={styles.landingForm} onSubmit={handleSignup}>
              {/* <div className={styles.date}>
                <FormControl sx={{ m: 1, width: { xs: '100%' } }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-date"></InputLabel>
                  <FilledInput
                    id="filled-adornment-date"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </FormControl>
              </div> */}
              <div className={styles.name}>
                <FormControl sx={{ m: 1, width: { xs: '100%' } }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-name">Name</InputLabel>
                  <FilledInput
                    id="filled-adornment-name"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                </FormControl>
              </div>
              <div className={styles.email}>
                <FormControl sx={{ m: 1, width: { xs: '100%' } }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-email">Email</InputLabel>
                  <FilledInput
                    id="filled-adornment-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </FormControl>
              </div>
              <div className={styles.password}>
                <FormControl sx={{ m: 1, width: { xs: '100%' } }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                  <FilledInput
                    id="filled-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </div>

              {/* <div className={styles.batch}>
                <FormControl sx={{ m: 1, width: { xs: '100%' } }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-batch">Batch</InputLabel>
                  <FilledInput
                    id="filled-adornment-batch"
                    type="text"
                    name="batch"
                    value={form.batch}
                    onChange={handleChange}
                  />
                </FormControl>
              </div> */}
    <div className={styles.dateBatchRow}>
  <div className={styles.date}>
    <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
      <InputLabel htmlFor="filled-adornment-date"></InputLabel>
      <FilledInput
        id="filled-adornment-date"
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
      />
    </FormControl>
  </div>
  <div className={styles.batch}>
    <FormControl sx={{ m: 1, width: '100%' }} variant="filled">
      <InputLabel htmlFor="filled-adornment-batch">Batch</InputLabel>
      <FilledInput
        id="filled-adornment-batch"
        type="text"
        name="batch"
        value={form.batch}
        onChange={handleChange}
      />
    </FormControl>
  </div>
</div>

              <div className={styles.btnDiv}>
                <button type="submit" className={styles.btnSubmit}>Sign Up</button>
              </div>

              <div className={styles.signupDiv}>
                <p className={styles.paragraph}>Already a Member?</p>
                <Link className={styles.signupLink} to="/" >Log In</Link>
              </div>
            </form>
          </div>
          <div className={styles.head}>
            <h1>Why Wait?</h1>
            <p>
              Create your account and unlock exclusive access to all of our features.
            </p>
          </div>
        </div>
      </div>
      {/* <footer className={styles.footerDiv}>
        <div className={}>
          Scipy Technologies
        </div>
      </footer> */}
      <Footer/>
    </div>
  );
}

export default SignUp;
