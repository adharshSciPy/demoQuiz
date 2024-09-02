import React from 'react'
import Logo from "../assets/Idea_2.png"
import './landing.css'

function LandingPage() {
    return (
        <div>
            <div className='container'>
                <h1>Welcome to Questionare Platform</h1>
                <div className='dashboard'>
                    <div className='head'><h1>Best Questionare Platform</h1></div>
                    <div className='dashimage'><img src={Logo} alt='logo' /></div>
                    <div className='button'>
                        

                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage