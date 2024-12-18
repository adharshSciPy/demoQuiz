import useAuth from "../hooks/useAuth";
import axios from "axios";
import React, { useState,useEffect } from "react";
import styles  from '../assets/css/studentDashboard.module.css';


function StDashboard(){
    const { loggedInUserId } = useAuth();
    console.log(loggedInUserId);
    
    const [profileData, setProfileData] = useState(null); // State to store profile data
    const [loading, setLoading] = useState(true); // State for loading indicator
    const [error, setError] = useState(null); // State for error handling

   
   

    useEffect(() => {
        const fetchProfileDetails = async () => {
          try {
            const response = await axios.get(`http://localhost:8000/api/v1/user/getuserById/${loggedInUserId}`);
            setProfileData(response.data.data);
            console.log(response.data.data);
            
             // Log fetche  d data for debugging
          } catch (error) {
            setError(error.message); // Save error message to state
            console.error("Error fetching profile data:", error);
          } finally {
            setLoading(false); // Set loading to false
          }
        };
        fetchProfileDetails()
      }, [loggedInUserId]);

    if (loading) {
        return <div>Loading...</div>; // Show loading message
    }

    if (error) {
        return <div>Error: {error}</div>; // Show error message
    }
    const SERVER_BASE_URL = "http://localhost:8000"; 
    return (
        <div className={styles.profileFeature}>
            <h1>Profile Details</h1>
            {profileData ? (
                <div className={styles.mainContainer}>
                    
                    <p><strong>FullName:</strong> {profileData.fullName}</p>
                    <p><strong>Email:</strong> {profileData.email}</p>
                    <p><strong>Phone:</strong> {profileData.phone}</p> 
                    <p><strong>Batch:</strong> {profileData.batch}</p> 

                    
                    {profileData.image && (
                        <div className={styles.imageContainer}>
                            <img 
                                src={`${SERVER_BASE_URL}${profileData.image}`} 
                                alt={`${profileData.image}'s Profile`} 
                                style={{ width: '150px', height: '150px', borderRadius: '50%' }} 
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div>No profile data found.</div>
            )}
        </div>
    );
};


export default StDashboard