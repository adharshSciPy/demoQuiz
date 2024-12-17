import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function ForgotPasswordStudent() {
  let field = {
    email: ''
  };
  const [form, setForm] = useState(field);
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loader
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/user/forgotpassworduser`, form);
      console.log("response from the forgot password", response.data);
      notifySuccess("Password reset link sent successfully!");
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
      setForm(field);
    } catch (error) {
      notifyError(error.response?.data?.message || "Invalid email. Please try again.");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <ToastContainer 
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover 
      />
      <div className="main">
        <h3>Password Reset</h3>
        <form className="landingForm" onSubmit={handleSignin}>
          <div className="subdiv">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={form.email} 
              name="email" 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="subdiv">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordStudent;
