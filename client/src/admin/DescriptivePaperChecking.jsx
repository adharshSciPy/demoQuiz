import React, { useEffect, useState } from "react";
import styles from "./../assets/css/descriptivePaperChecking.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

function DescriptivePaperChecking() {
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState({});
  const[mark,setMark]=useState();

  const { userId, sessionId } = useParams();
  const location = useLocation();
  const { sectionDetails, answerId, questionId } = location.state || {};

  const fetchDescriptiveData = async () => {
    const response = await axios.get(`http://localhost:8000/api/v1/user/getsingledescriptivequestion/${sectionDetails.sectionId}`, {
      params: { questionId },
    });
    setQuestion(response.data.data);

    const getAnswers = await axios.get(`http://localhost:8000/api/v1/user/getsingledescriptiveanswers`, {
      params: { answerId },
    });
    setAnswers(getAnswers.data.data);
  };
  const handleClick=async(sectionId,questionId,userId)=>{
    try {
      
    } catch (error) {
      
    }
   
  }

  useEffect(() => {
    fetchDescriptiveData();
  }, []);

  return (
    <div className={styles.outerDivMain}>
      <Navbar />
      <div className={styles.main}>
        <h2 className={styles.sectionName}>Section Name: Section two</h2>
        <div className={styles.subDiv}>
          <div className={styles.displayField}>
            <h5 className={styles.questionHead}>Question</h5>
            <p className={styles.questionDisplay}>{question.question}</p>
            <h5 className={styles.AnswerHead}>User Answer</h5>
            {answers.answerText !== "skipped" ? (
              <p className={styles.answerDisplay}>{answers.answerText}</p>
            ) : (
              <p className={styles.answerDisplay}>The question was skipped.</p>
            )}
            {answers.answerText !== "skipped" && (
              <>
                <div className={styles.mark}>
                  <label htmlFor="text">Mark</label>
                  <input type="number" value={mark} onChange={(e)=>setMark(e.target.value)} />
                </div>
                <div className={styles.buttonDiv}>
                  <button className={styles.button} onClick={()=>handleClick(sectionDetails.sectionId,questionId)}>Submit</button>
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
