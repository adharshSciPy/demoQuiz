import React, { useState } from "react";
import styles from "../assets/css/signup.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FilledInput from "@mui/material/FilledInput";
import Footer from "../footer/Footer";
import { Grid } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';


function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasMinLength: false,
  });
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => event.preventDefault();
    const notifyError = (message) => toast.error(message);
  
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    batch: "",
    date: "",
  });

  const navigate = useNavigate(); 

  const validatePassword = (password) => {
    const validation = {
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasMinLength: password.length >= 8,
    };
    setPasswordValidation(validation);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      validatePassword(value);
    }
    setForm({ ...form, [name]: value });
  };
  const handleSignup = async (e) => {
    e.preventDefault(); 
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        form
      );
      if (response.status === 201) {
        toast.success("User Registration Successful");
        navigate("/"); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Registration failed";
      notifyError(errorMessage); 
    }
  };
  

  return (
    <div className={styles.body}>
         <ToastContainer position="bottom-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              pauseOnHover />
      <div className={styles.container}>
        <div className={styles.dashboard}>
          <div className={styles.button}>
            <form className={styles.landingForm} onSubmit={handleSignup}>
              <div className={styles.name}>
                <FormControl sx={{ m: 1, width: { xs: "100%" } }} variant="filled">
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
                <FormControl sx={{ m: 1, width: { xs: "100%" } }} variant="filled">
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
                <FormControl sx={{ m: 1, width: { xs: "100%" } }} variant="filled">
                  <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
                  <FilledInput
  id="filled-adornment-password"
  type={showPassword ? "text" : "password"}
  name="password"
  value={form.password}
  onChange={handleChange}
  onFocus={() => setPasswordFocus(true)}
  onBlur={() => setPasswordFocus(false)}
  endAdornment={
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        edge="end"
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  }
/>

                </FormControl>
                {/* Password Validation Points */}
                {passwordFocus && (
  <ul className={styles.passwordValidation}>
    <li
      style={{
        color: passwordValidation.hasMinLength ? "green" : "red",
        fontSize: "12px",
        textAlign: "left",
      }}
    >
      &#8226; At least 8 characters long
    </li>
    <li
      style={{
        color: passwordValidation.hasLowercase ? "green" : "red",
        fontSize: "12px",
        textAlign: "left",
      }}
    >
      &#8226; At least one lowercase letter
    </li>
    <li
      style={{
        color: passwordValidation.hasUppercase ? "green" : "red",
        fontSize: "12px",
        textAlign: "left",
      }}
    >
      &#8226; At least one uppercase letter
    </li>
    <li
      style={{
        color: passwordValidation.hasNumber ? "green" : "red",
        fontSize: "12px",
        textAlign: "left",
      }}
    >
      &#8226; At least one number
    </li>
  </ul>
)}

              </div>

              <div className={styles.dateBatchRow}>
                <div className={styles.date}>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="filled">
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
                  <FormControl sx={{ m: 1, width: "100%" }} variant="filled">
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
                <button type="submit" className={styles.btnSubmit}>
                  Sign Up
                </button>
              </div>

              <div className={styles.signupDiv}>
                <p className={styles.paragraph}>Already a Member?</p>
                <Link className={styles.signupLink} to="/">
                  Log In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignUp;
