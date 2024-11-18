import React, { useEffect, useState } from "react";
import styles from "./../assets/css/descriptivePaperChecking.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

function DescriptivePaperChecking() {
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState({});
  const [mark, setMark] = useState("");

  const { userId, sessionId } = useParams();
  const location = useLocation();
  const { sectionDetails, answerId, questionId } = location.state || {};

  // Fetch question and answer data
  const fetchDescriptiveData = async () => {
    try {
      // Fetch the question
      const questionResponse = await axios.get(
        `http://localhost:8000/api/v1/user/getsingledescriptivequestion/${sectionDetails.sectionId}`,
        { params: { questionId } }
      );
      setQuestion(questionResponse.data.data);

      // Fetch the answer
      const answerResponse = await axios.get(
        `http://localhost:8000/api/v1/user/getsingledescriptiveanswers`,
        { params: { answerId } }
      );
      setAnswers(answerResponse.data.data);
    } catch (error) {
      console.error("Error fetching descriptive data:", error);
      alert("Failed to fetch data. Please try again later.");
    }
  };

  // Submit marks for the question
  const handleClick = async () => {
    if (!mark) {
        alert("Please enter a valid mark before submitting.");
        return;
    }

    if (parseFloat(mark) > question.mark) {
        alert(`Mark cannot exceed the maximum allowed mark of ${question.mark}.`);
        return;
    }

    try {
        const response = await axios.patch(
            `http://localhost:8000/api/v1/admin/descriptiveMark/${userId}`,
            {
                sectionId: sectionDetails.sectionId,
                questionId,
                mark: parseFloat(mark),
            }
        );
        alert("Mark submitted successfully!");
        setMark("");
    } catch (error) {
        console.error("Error submitting marks:", error);
        alert("Failed to submit marks. Please try again.");
    }
};

const handleMarkInputChange = (e) => {
    const inputMark = e.target.value;
    if (inputMark <= question.mark) {
        setMark(inputMark);
    } else {
        alert(`Mark cannot exceed the maximum allowed mark of ${question.mark}.`);
    }
};


  useEffect(() => {
    fetchDescriptiveData();
  }, []);

  return (
    <div className={styles.outerDivMain}>
      <Navbar />
      <div className={styles.main}>
        <h2 className={styles.sectionName}>
          Section Name: {sectionDetails?.sectionName || "Section"}
        </h2>
        <div className={styles.subDiv}>
          <div className={styles.displayField}>
            {/* Display Question */}
            <h5 className={styles.questionHead}>Question</h5>
            <p className={styles.questionDisplay}>{question.question || "Loading question..."}</p>

            {/* Display User's Answer */}
            <h5 className={styles.AnswerHead}>User Answer</h5>
            {answers.answerText !== "skipped" ? (
              <p className={styles.answerDisplay}>{answers.answerText}</p>
            ) : (
              <p className={styles.answerDisplay}>The question was skipped.</p>
            )}

            {/* Mark Input and Submit Button */}
            {answers.answerText !== "skipped" && (
              <>
                <div className={styles.mark}>
                  <label htmlFor="markInput">Mark</label>
                  <input
                    type="number"
                    id="markInput"
                    value={mark}
                    onChange={(e) => setMark(e.target.value)}
                    placeholder="Enter marks"
                  />
                </div>
                <div className={styles.buttonDiv}>
                  <button
                    className={styles.button}
                    onClick={handleClick}
                    disabled={!mark}
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DescriptivePaperChecking;
