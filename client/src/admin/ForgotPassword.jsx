
import React from "react";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/css/Password.module.css'
import Footer from "../footer/Footer";
import FilledInput from '@mui/material/FilledInput';

function ForgotPassword() {
    let field={
        email:''
    }
  const [form, setForm] = useState(field);
  const [errorMessage, setErrorMessage] = useState(""); 
   const [isLoading, setIsLoading] = useState(false);
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
    const navigate = useNavigate();
  

  const handleSignin=async(e)=>{
    e.preventDefault();
    setIsLoading(true); // Start loader
    setIsLoading(true);
    try {
       const response=await axios.post(`http://localhost:8000/api/v1/admin/forgotpassword`,form) 
       console.log("response from the forgot password",response.data)
       notifySuccess("Password reset link sent successfully!");
       setTimeout(() => {
        navigate('/adminlogin');
      }, 2000);
       setForm(field)
    } catch (error) {
        setErrorMessage(error.response?.data?.message || "Invalid email . Please try again.");
        notifyError(error.response?.data?.message)    }
        finally {
          setIsLoading(false); // Stop loader
        }
  }
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
 
  return (
    
    <div>
           <ToastContainer position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover />
       <div className={styles.main}>
        <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSignin}>
        <h3>Password Reset</h3>
          <div className={styles.subdiv}>
            {/* <label htmlFor="email">Email</label> */}
            <FilledInput
                    id="filled-adornment-email"
                    type="email"
                    name="email"
                    value={form.email}
                            className={styles.passwordField}
                    placeholder="Enter your Email Here"
                    onChange={handleChange}
                  />
          </div>
          <div className={styles.subDiv}>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Link"}
            </button>
          </div>
        </form>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default ForgotPassword;
