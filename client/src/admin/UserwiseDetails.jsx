import React, { useState, useEffect } from "react";
import styles from "./../assets/css/userwiseDetails.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";

function UserwiseDetails() {
  const { userId } = useParams();
  const [details, setDetails] = useState({});
  const [sectionData, setSectionData] = useState({}); // Store section names and question types by sectionId
  const navigate=useNavigate();
  const fetchUserData = async () => {
    try {
      // Fetch user details
      const response = await axios.get(
        `http://localhost:8000/api/v1/user/getuserById/${userId}`
      );
      const userData = response.data.data;
      setDetails(userData);

      // Get unique sectionIds from user sessions
      const uniqueSectionIds = Array.from(
        new Set(userData.sessions.map((session) => session.sectionId))
      );

      // Fetch section names and question types for each unique sectionId
      const sectionPromises = uniqueSectionIds.map((sectionId) =>
        axios
          .get(`http://localhost:8000/api/v1/section/getsectionsbyid/${sectionId}`)
          .then((res) => ({
            id: sectionId,
            name: res.data.data.sectionName,
            questionType: res.data.data.questionType, // Assume questionType is part of the response
          }))
      );

      // Resolve all promises and map sectionIds to section details
      const resolvedSections = await Promise.all(sectionPromises);
      const sectionDataMap = resolvedSections.reduce((acc, section) => {
        acc[section.id] = { name: section.name, questionType: section.questionType };
        return acc;
      }, {});

      setSectionData(sectionDataMap); // Store fetched section data in state
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchUserData();

    const interval = setInterval(() => {
      fetchUserData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (sessionId) => {
    navigate(`/usermcqtable/${sessionId}`)
    
  };

  return (
    <div>
      <Navbar />
      <div className={styles.main}>
        <h1 className={styles.mainHead}>User Details</h1>
        <div className={styles.subDiv}>
          <h3 className={styles.userName}>Name: {details.fullName}</h3>
          <div className={styles.detailsDiv}>
            <p className={styles.para}>Batch: {details.batch}</p>
            <p className={styles.para}>Email: {details.email}</p>
            <p className={styles.para}>
              Total Sections: {details.sessions ? details.sessions.length : 0}
            </p>
          </div>
          {details.sessions && details.sessions.length > 0 ? (
            <div className={styles.detailCards}>
              {details.sessions.map((session, index) => (
                <div key={index} className={styles.card}>
                  <h4>
                    {sectionData[session.sectionId]?.name || "Loading..."}
                  </h4>
                  <button
                    className={styles.button}
                    onClick={() => handleClick(session._id)}
                  >
                    {sectionData[session.sectionId]?.questionType === "MCQ"
                      ? "View"
                      : "Evaluate"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noData}>No data available</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserwiseDetails;
