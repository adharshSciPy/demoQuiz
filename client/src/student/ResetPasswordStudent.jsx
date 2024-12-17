import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';


function ResetPasswordStudent() {
    let field = {
        
        password: ""
      };
      const{id,token}=useParams();
      const navigate = useNavigate();
    const[form,setForm]=useState(field);
    const handlePasswordReset=async(e,)=>{
      e.preventDefault();
      try {
        const response=await axios.post(`http://localhost:8000/api/v1/user/resetpassworduser/${id}/${token}`,form)
        console.log("psd reset",response.status);
        const status=response.status;
        if(status===200){
          navigate('/')
        }

      } catch (error) {
        console.log("error",error)
      }
    }
    const handleChange=(e)=>{
      setForm({
        ...form,
        [e.target.name]: e.target.value
      });
    }
    
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
<form className="landingForm"  onSubmit={handlePasswordReset}>

 <div className="subdiv">
    <h4>Reset Password User</h4>
 <label htmlFor="">New Password</label>
 <input
  type="password"
   id="password"
    value={form.newPassword}
     name="password"
      required placeholder='Enter new password'
      onChange={handleChange} />
 </div>
 <div className="subdiv">
     <button type="submit" >Reset Password</button>
 </div>
</form>

</div>
</div>
  )
}

export default ResetPasswordStudent
