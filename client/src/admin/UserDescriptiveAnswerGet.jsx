import React, { useState, useEffect } from "react";
import styles from "./../assets/css/userDescriptiveAnswerGet.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toastify

import { useParams, useNavigate, useLocation } from "react-router-dom";

function UserDescriptiveAnswerGet() {
  const [data, setData] = useState([]); // Data state
  const [loading, setLoading] = useState(true); // Loading state
  const { userId, sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionDetails } = location.state || {};

  // Fetch descriptive answers
  const fetchDescriptiveData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/admin/getdescriptiveAnswerfromUser`,
        { params: { userId, sessionId } }
      );
      setData(response.data.descriptiveAnswers || []); // Update data state
    } catch (error) {
      console.error("Error fetching descriptive answers:", error);
      toast.error("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false); // Stop loading once the request completes
    }
  };

  useEffect(() => {
    fetchDescriptiveData();
  }, []); // Dependency array ensures this runs only once

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
          <h1 className={styles.userHead}> Descriptive Answers</h1>
          <div className={styles.mainCard}>
            <div className={styles.cardContainer}>
              {/* Show loader if loading */}
              {loading ? (
                <p>Loading answers...</p>
              ) : data.length > 0 ? (
                // Render data when available
                data.map((answer, index) => (
                  <div className={styles.card} key={answer._id}>
                    <h4>Question {index + 1}</h4>
                    {/* Uncomment these lines if you want to display more details */}
                    {/* <p>Answer: {answer.answerText}</p> */}
                    <p>Marks: {answer.markObtained}</p>
                    <button
                      className={styles.viewButton}
                      onClick={() =>
                        handleClick(
                          sessionId, // Assuming sessionId is from params
                          answer.sectionId,
                          answer._id,
                          answer.questionId
                        )
                      }
                    >
                      View
                    </button>
                  </div>
                ))
              ) : (
                <p>No descriptive answers available.</p>
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
