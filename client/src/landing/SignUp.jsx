import React from 'react'

import '../assets/css/landing.css'
import { Link } from 'react-router-dom'

function SignUp() {
    return (
        <div className='body'>
            <div className='container'>
            
                <div className='dashboard'>
                    
                   
                   
                    <div className='button'>
                        <form  className="landingForm">
                        <div className="name">
                            <label htmlFor="name" className="label-name">Name</label>
                            <input className='input-name' type="text" placeholder='Enter your Name' />
                        </div>
                        <div className="email">
                            <label htmlFor="email" className="label-email">Email</label>
                            <input className='input-email' type="email" placeholder='Enter your Email' />
                        </div>
                        <div className="password">
                            <label htmlFor="password" className="label-password">Password</label>
                            <input className='input-password' type="password" placeholder='Enter your password' />
                        </div>
                
                        <div className="btn-div">
                            <button type="submit" className="btn-submit">Sign Up</button>
                        </div>

                        <div className="signup-div">
                            <p className='paragraph'>Already a Member?</p>
                            <Link className='signup-link' to="/">Log In</Link>

                        </div>


                        </form>
                        
                        

                    </div>
                    <div className='head'><h1>Why Wait?</h1>
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
    )
}

export default SignUp;