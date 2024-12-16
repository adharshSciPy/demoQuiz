
import React from "react";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
    let field={
        email:''
    }
  const [form, setForm] = useState(field);
  const [errorMessage, setErrorMessage] = useState(""); 
  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleSignin=async(e)=>{
    e.preventDefault();
    try {
       const response=await axios.post(`http://localhost:8000/api/v1/admin/forgotpassword`,form) 
       console.log("response from the forgot password",response.data)
       notifySuccess("Password reset link sent successfully!");
       setForm(field)
    } catch (error) {
        setErrorMessage(error.response?.data?.message || "Invalid email . Please try again.");
        notifyError(error.response?.data?.message)    }
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
      <div className="main">
      <form className="landingForm" onSubmit={handleSignin}>

        <div className="subdiv">
        <label htmlFor="">Email</label>
        <input type="email" id="email" value={form.email} name="email" onChange={handleChange} required />
        </div>
        <div className="subdiv">
            <button type="submit">Send Link</button>
        </div>
</form>

      </div>
    </div>
  );
}

export default ForgotPassword;
