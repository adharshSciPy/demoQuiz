import {React,useState} from 'react'
import axios from 'axios'
import '../assets/css/landing.css'
import { Link } from 'react-router-dom'
import Footer from '../footer/Footer'

function LandingPage() {
    let field={
        email:"",
        password:""
    }
    const [form,setForm]=useState(field)
    const handleSignin=async ()=>{
        try {
            const response =await axios.post(`http://localhost:8000/api/v1/user/login`,form)
            console.log(response)
            
        } catch (error) {
            alert(error)
        }

    }

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
                            <button type="submit" className="btn-submit"onClick={handleSignin}>Sign In</button>
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

           <Footer/>
        </div>
    )
}

export default LandingPage