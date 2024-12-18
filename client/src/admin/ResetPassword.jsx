import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../assets/css/Password.module.css';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FilledInput from '@mui/material/FilledInput';
import Footer from '../footer/Footer';


function ResetPassword() {
    let field = {
        
        password: ""
      };
      const{id,token}=useParams();
      const navigate = useNavigate();
    const[form,setForm]=useState(field);
     const [showPassword, setShowPassword] = React.useState(false);
        const [isLoading, setIsLoading] = useState(false); // State for loader
      
      const [passwordValidation, setPasswordValidation] = useState({
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasMinLength: false,
      });
      const [passwordFocus, setPasswordFocus] = useState(false);
    
      const validatePassword = (password) => {
        const validation = {
          hasLowercase: /[a-z]/.test(password),
          hasUppercase: /[A-Z]/.test(password),
          hasNumber: /\d/.test(password),
          hasMinLength: password.length >= 8,
        };
        setPasswordValidation(validation);
      };
    
      const handleClickShowPassword = () => setShowPassword((show) => !show);
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    
      const handleMouseUpPassword = (event) => {
        event.preventDefault();
      };
    const handlePasswordReset=async(e,)=>{
      e.preventDefault();
      try {
        const response=await axios.post(`http://localhost:8000/api/v1/admin/resetpassword/${id}/${token}`,form)
        console.log("psd reset",response.status);
        const status=response.status;
           if (status === 200) {
              toast.success('Password reset successfully!', { autoClose: 2000 });
              setTimeout(() => {
                navigate('/adminlogin');
              }, 2000);
            }
          } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to reset password. Please try again.', { autoClose: 2000 });
          }
    }
    const handleChange=(e)=>{
      const { name, value } = e.target;
      if (name === 'password') {
        validatePassword(value);
      }
      setForm({ ...form, [name]: value });
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
 <div className={styles.main}>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handlePasswordReset}>
            <div className={styles.passwordFieldContainer}>
              <label htmlFor="filled-adornment-password">New Password</label>
              <FilledInput
                id="filled-adornment-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                className={styles.passwordField}
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
              {passwordFocus && (
                <ul className={styles.passwordValidation}>
                  <li
                    style={{
                      color: passwordValidation.hasMinLength ? 'green' : 'red',
                      fontSize: '12px',
                      textAlign: 'left',
                    }}
                  >
                    &#8226; At least 8 characters long
                  </li>
                  <li
                    style={{
                      color: passwordValidation.hasLowercase ? 'green' : 'red',
                      fontSize: '12px',
                      textAlign: 'left',
                    }}
                  >
                    &#8226; At least one lowercase letter
                  </li>
                  <li
                    style={{
                      color: passwordValidation.hasUppercase ? 'green' : 'red',
                      fontSize: '12px',
                      textAlign: 'left',
                    }}
                  >
                    &#8226; At least one uppercase letter
                  </li>
                  <li
                    style={{
                      color: passwordValidation.hasNumber ? 'green' : 'red',
                      fontSize: '12px',
                      textAlign: 'left',
                    }}
                  >
                    &#8226; At least one number
                  </li>
                </ul>
              )}
            </div>

            <div className={styles.subDiv}>
              <button type="submit" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}

              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
</div>
  )
}

export default ResetPassword
