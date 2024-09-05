import React from 'react'

import '../assets/css/landing.css'
import { Link } from 'react-router-dom'

function LandingPage() {
    return (
        <div className='body'>
            <div className='container'>
            
                <div className='dashboard'>
                    
                   
                   
                    <div className='button'>
                        <form  className="landingForm">
                       
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
                            <p className='paragraph'>Create Your Account</p>
                            <Link className='signup-link' to="/signup">Sign Up</Link>

                        </div>


                        </form>
                        
                        

                    </div>
                    <div className='head'><h1>Welcome to Eduapp</h1>
                    <p>Dive into a diverse world of quizzes with Eduapp. Whether you're a tech enthusiast or just love trivia, our app offers a rich blend of technical and non-technical questions to challenge and entertain you.</p></div>
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