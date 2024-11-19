import React, { useState, useEffect } from "react";
import styles from "./../assets/css/userDescriptiveAnswerGet.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function UserDescriptiveAnswerGet() {
  const [data, setData] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionDetails } = location.state || {};

  const fetchDescriptiveData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/admin/getdescriptiveAnswerfromUser`,
        { params: { userId } }
      );
      setData(response.data.descriptiveSessions);
    } catch (error) {
      console.error("Error fetching descriptive answers:", error);
      alert("Failed to fetch data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchDescriptiveData();
  }, []);

  const handleClick = (sessionId, sectionId, answerId, questionId) => {
    navigate(`/descriptivepaper/${userId}/${sessionId}`, {
      state: { sectionDetails, answerId, questionId },
    });
  };

  return (
    <div>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.subDiv}>
          <h1 className={styles.userHead}>User Descriptive Answer Table</h1>
          <div className={styles.mainCard}>
            <div className={styles.cardContainer}>
              {data.map((session) =>
                session.descriptiveAnswers.map((answer, index) => (
                  <div className={styles.card} key={`${session._id}-${index}`}>
                    <h4>Question {index + 1}</h4>
                    <button
                      className={styles.viewButton}
                      onClick={() =>
                        handleClick(
                          session._id,
                          session.sectionId,
                          answer._id,
                          answer.questionId
                        )
                      }
                    >
                      View
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserDescriptiveAnswerGet;
