import useAuth from "../hooks/useAuth";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/css/profileView.css";
import Navbar from "../navbar/Navbar";
import styles from "../assets/css/signup.module.css";
import { Button } from "@mui/material";


function ProfileView() {
  const navigate = useNavigate();
  const showEdit= async(e)=>{
    navigate("/edit")
    
  }
  const { loggedInUserId } = useAuth();
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/admin/showAdmin/${loggedInUserId}`
        );
        setProfileData(response.data); // Save response data to state
      } catch (error) {
        setError(error.message); // Save error message to state
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    if (loggedInUserId) {
      fetchProfileDetails();
    }
  }, [loggedInUserId]);

  if (loading) {
    return <div>Loading...</div>; // Show loading message
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }
  const SERVER_BASE_URL = "http://localhost:8000";
  return (
    <div>
      <Navbar />
      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.dashboard}>
            <div className={styles.button}>
              {profileData ? (
                <div className="main-container">
                  <div className="edit-container">
                    <Button
                      onClick={showEdit}
                      variant="contained"
                      color="primary"
                      sx={{ m: 1 }}
                    >
                      Edit
                    </Button>
                  </div>
                  <div className="sub-container">
                    <div className="image-container">
                      {profileData.image && (
                        <div>
                          <img
                            src={`${SERVER_BASE_URL}${profileData.image}`}
                            alt={`${profileData.image}'s Profile`}
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "10px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="contents">
                      <p>
                        <strong>FullName:</strong> {profileData.fullName}
                      </p>
                      <p>
                        <strong>Email:</strong> {profileData.email}
                      </p>
                      <p>
                        <strong>PhoneNumber:</strong> {profileData.phoneNumber}
                      </p>
                      <p>
                        <strong>SchoolName:</strong> {profileData.schoolName}
                      </p>
                      <p>
                        <strong>Address:</strong> {profileData.address}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>No profile data found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
