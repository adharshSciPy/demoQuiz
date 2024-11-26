import React, { useState, useEffect } from "react";
import styles from "./../assets/css/userwiseDetails.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UserwiseDetails() {
  const { userId } = useParams();
  const [details, setDetails] = useState({});
  const [sectionData, setSectionData] = useState({}); // Store section names and question types by sectionId
  const navigate = useNavigate();
  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/user/getuserById/${userId}`
      );
      const userData = response.data.data;
  
      // Fetch section details as before
      const uniqueSectionIds = Array.from(
        new Set(userData.sessions.map((session) => session.sectionId))
      );
  
      const sectionPromises = uniqueSectionIds.map(async (sectionId) => {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/v1/section/getsectionsbyid/${sectionId}`
          );
          if (res.data && res.data.data) {
            return {
              id: sectionId,
              name: res.data.data.sectionName,
              questionType: res.data.data.questionType,
            };
          }
        } catch (error) {
          console.error(`Error fetching section for ${sectionId}`, error);
        }
        return null;
      });
  
      const resolvedSections = await Promise.all(sectionPromises);
      const sectionDataMap = resolvedSections.reduce((acc, section) => {
        if (section) acc[section.id] = section;
        return acc;
      }, {});
  
      setSectionData(sectionDataMap);
      setDetails(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  useEffect(() => {
    fetchUserData();

    const interval = setInterval(() => {
      fetchUserData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (userId, sessionId, sectionId, buttonType) => {
    const specificSectionData = { ...sectionData[sectionId], sectionId };
  
    switch (buttonType) {
      case "view":
        navigate(`/usermcqtable/${userId}/${sessionId}`, {
          state: { sectionDetails: specificSectionData },
        });
        break;
  
      case "evaluate":
        navigate(`/userdescriptiveanswerget/${userId}/${sessionId}`, {
          state: { sectionDetails: specificSectionData },
        });
        break;
  
      case "show":
        // Additional navigation or logic for "Evaluate"
        navigate(`/userdescriptivetable/${userId}/${sessionId}`, {
          state: { sectionDetails: specificSectionData },
        });
        break;
  
      default:
        console.error("Invalid button type");
    }
  };
  

  return (
    <div>
      <Navbar />
      <div className={styles.main}>
        {/* <h1 className={styles.mainHead}>User Details</h1> */}
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
      {sectionData[session.sectionId]?.name || session.sessionName || "Unknown"}
    </h4>
    {session.isDeleted ? (
      <button className={`${styles.button} ${styles.disqualified}`} disabled>
        Deleted
      </button>
    ) : session.performance === "Disqualified" ? (
      <button className={`${styles.button} ${styles.disqualified}`} disabled>
        Disqualified
      </button>
    ) : sectionData[session.sectionId]?.questionType === "MCQ" ? (
      <button
        className={`${styles.button} ${styles.view}`}
        onClick={() =>
          handleClick(userId, session._id, session.sectionId, "view")
        }
      >
        View
      </button>
    ) : (
      <>
        <button
          className={`${styles.button} ${styles.show}`}
          onClick={() =>
            handleClick(userId, session._id, session.sectionId, "show")
          }
        >
          Show
        </button>
        <button
          className={`${styles.button} ${styles.evaluate}`}
          onClick={() =>
            handleClick(userId, session._id, session.sectionId, "evaluate")
          }
        >
          Evaluate
        </button>
      </>
    )}
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
