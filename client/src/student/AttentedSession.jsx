import React, { useState, useEffect } from "react";
import style from "../assets/css/studentAttentedSession.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";

function AttentedSession() {
  const [userDetails, setUserDetails] = useState(null);
  const [sessionCount, setSessionCount] = useState([]); 
  const [sessionDetails, setSessionDetails] = useState([]); // To store detailed session info
  const { loggedInUserId } = useParams();
  console.log("gokul",loggedInUserId)

  const getUserdetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/user/getuserById/${loggedInUserId}`
      );
      setUserDetails(response.data.data);

      setSessionCount(response.data.data.sessions || []); // Ensure session count is populated
      console.log("aaaaaa", sessionCount);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const getSessionsById = async (sectionId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/section/getsectionsbyid/${sectionId}`
      );
      console.log("haai", response.data.data); 
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching section details for ${sectionId}:`, error);
      return null; 
    }
  };

  const fetchAllSessionDetails = async () => {
    try {
      const detailedSessions = await Promise.all(
        sessionCount.map(async (session) => {
          const sessionDetails = await getSessionsById(session.sectionId);
          // Add the score from sessionCount to sessionDetails
          if (sessionDetails) {
            sessionDetails.score = session.score; // Assuming 'score' is inside sessionCount
          }
          return sessionDetails;
        })
      );
      setSessionDetails(detailedSessions.filter((session) => session !== null));
    } catch (error) {
      console.log("Error fetching all section details", error);
    }
  };

  useEffect(() => {
    getUserdetails();
  }, []);

  useEffect(() => {
    if (sessionCount.length > 0) {
      fetchAllSessionDetails();
    }
  }, [sessionCount]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className={style.container}>
      <h3>Attended Sessions</h3>
      {sessionDetails.map((session, index) => (
        <div key={session._id || index} className={style.card}>
          <h3>{session.sectionName || "Session Title"}</h3>
          <p>{session.date || "Session Created"}</p>
          <p>{session.questionType || "Question Type"}</p>
          <p>{session.score !== undefined ? `Score: ${session.score}` : "No Score Available"}</p> {/* Display score */}
        </div>
      ))}
    </div>
  );
}

export default AttentedSession;
