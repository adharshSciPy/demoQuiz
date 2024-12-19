import React, { useEffect, useState } from "react";
import styles from "./../assets/css/descriptivePaperChecking.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toastify
import { Breadcrumb } from "react-bootstrap";

function DescriptivePaperChecking() {
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState({});
  const [mark, setMark] = useState("");
  const { userId, sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { sectionDetails, answerId, questionId } = location.state || {};

  useEffect(() => {
    if (!sectionDetails || !answerId || !questionId) {
      toast.error("Missing data for descriptive paper checking.");
      navigate(-1); // Navigate back if state is missing
      return;
    }
    fetchDescriptiveData();
  }, [sectionDetails, answerId, questionId]);

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
      setTimeout(() => {
        navigate(`/userdescriptiveanswerget/${userId}/${sessionId}`, {
          state: { sectionDetails },
        });
      }, 1000);
    } catch (error) {
      console.error("Error submitting marks:", error);
      toast.error("Failed to submit marks. Please try again.");
    }
  };

  return (
    <div className={styles.outerDivMain}>
      <Navbar />
      <Breadcrumb>
        <Breadcrumb.Item
          style={{
            fontWeight: "700",
            padding: "10px 15px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
            position: "relative",
            left: "20px",
            top: "20px",
            fontSize: "16px",
            boxShadow: "0 2px 5px rgba(70, 67, 67, 0.1)",
          }}
        >
          <Link
            to={`/userdescriptiveanswerget/${userId}/${sessionId}`}
            state={{
              sectionDetails,
              answerId: answers.id,
              questionId: question.id,
            }}
            style={{
              textDecoration: "none",
              color: "#4a148c",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "16px",
            }}
          >
            Back
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
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
      {/* Toast container to show the errors */}
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
    </div>
  );
}

export default DescriptivePaperChecking;
