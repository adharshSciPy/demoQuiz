import React, { useEffect, useState } from "react";
import styles from "./../assets/css/descriptivePaperChecking.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toastify

function DescriptivePaperChecking() {
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState({});
  const [mark, setMark] = useState("");
  const { userId, sessionId } = useParams();
  const location = useLocation();
  const { sectionDetails, answerId, questionId } = location.state || {};
  const navigate = useNavigate();

  // Fetch question and answer data
  const fetchDescriptiveData = async () => {
    try {
      const questionResponse = await axios.get(
        `http://localhost:8000/api/v1/user/getsingledescriptivequestion/${sectionDetails.sectionId}`,
        { params: { questionId } }
      );
      setQuestion(questionResponse.data.data);

      const answerResponse = await axios.get(
        `http://localhost:8000/api/v1/user/getsingledescriptiveanswers`,
        { params: { answerId } }
      );
      setAnswers(answerResponse.data.data);
    } catch (error) {
      console.error("Error fetching descriptive data:", error);
      toast.error("Failed to fetch data. Please try again later.");
    }
  };

  // Handle submitting the mark
  const handleClick = async () => {
    if (!mark || parseFloat(mark) > question.mark) {
      toast.error(`Please enter a valid mark (0 - ${question.mark}).`);
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8000/api/v1/admin/descriptiveMark/${userId}`,
        {
          sectionId: sectionDetails.sectionId,
          questionId,
          mark: parseFloat(mark),
        }
      );
      toast.success("Mark submitted successfully!");
      setTimeout(()=>{
        navigate(`/userdescriptiveanswerget/${userId}/${sessionId}`, {
          state: { sectionDetails },
        });
        
      },1000) 
    } catch (error) {
      console.error("Error submitting marks:", error);
      toast.error("Failed to submit marks. Please try again.");
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
            <h5 className={styles.questionHead}>Question</h5>
            <p className={styles.questionDisplay}>
              {question.question || "Loading question..."}
            </p>
            <h5 className={styles.AnswerHead}>User Answer</h5>
            {answers.answerText !== "skipped" ? (
              <p className={styles.answerDisplay}>{answers.answerText}</p>
            ) : (
              <p className={styles.answerDisplay}>The question was skipped.</p>
            )}
            {answers.answerText !== "skipped" && (
              <>
                <div className={styles.mark}>
                  <label htmlFor="markInput">Mark</label>
                  <input
                    type="number"
                    id="markInput"
                    value={mark}
                    onChange={(e) => setMark(e.target.value)}
                    // placeholder="Enter marks"
                  />
                </div>
                <div className={styles.buttonDiv}>
                  <button className={styles.button} onClick={handleClick}>
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
      {/* toast container to show the errors */}
      <ToastContainer position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover />
    </div>
  );
}

export default DescriptivePaperChecking;
