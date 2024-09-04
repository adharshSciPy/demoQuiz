import React from 'react'
import Logo from "../assets/Idea_2.png"
import './landing.css'
import { Link } from 'react-router-dom'

function LandingPage() {
    return (
        <div>
            <div className='container'>
            <h1>Welcome to Questionare Platform</h1>
                <div className='dashboard'>
                    
                    <div className='head'><h1>Best Questionare Platform</h1></div>
                    <div className='dashimage'><img src={Logo} alt='logo' /></div>
                    <div className='button'>
                        <form  className="landingForm">
                        <div className="select-form">
                          <label className='label-Role' htmlFor="role">Role</label>  
                          <select className="" aria-label="role" aria-describedby="role">
                            <option selected value={1}>Admin</option>
                            <option selected value={2}>User</option>

                          </select>
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
                            <button type="submit" className="btn-submit">Sign In</button>
                        </div>

                        <div className="signup-div">
                            <p className='paragraph'>If not user</p>
                            <Link className='signup-link' to="/signup">SignUp</Link>

                        </div>


                        </form>
                        
                        

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

export default LandingPage