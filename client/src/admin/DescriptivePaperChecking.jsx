import React, { useEffect, useState } from "react";
import styles from "./../assets/css/descriptivePaperChecking.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

function DescriptivePaperChecking() {

  const[question,setQuestion]=useState({});

  const { userId, sessionId } = useParams();
  const location = useLocation();
  const { sectionDetails, answerId, questionId } = location.state || {};
  // console.log("section details on the descriptive paper", sectionDetails);
  // console.log("answer id from user", answerId);
  // console.log("question id from user", questionId);

  const fetchDescriptiveData = async () => {
    const response=await axios.get(`http://localhost:8000/api/v1/user/getsingledescriptivequestion/${sectionDetails.sectionId}`,{
      params:{questionId},
    })
    setQuestion(response.data.data)
    console.log("question",response.data)
  };
  useEffect(()=>{
fetchDescriptiveData();
  },[])

  return (
    <div className={styles.outerDivMain}>
      <Navbar />
      <div className={styles.main}>
        <h2 className={styles.sectionName}>Section Name: Section two</h2>
        <div className={styles.subDiv}>
          <div className={styles.displayField}>
            {question.map}
            <h5 className={styles.questionHead}>Question</h5>
            <p className={styles.questionDisplay}>
              {question.question}
            </p>
            <h5 className={styles.AnswerHead}> User Answer</h5>
            <p className={styles.answerDisplay}>
              this is the answer for question number 1
            </p>
            <div className={styles.mark}>
              <label htmlFor="text">Mark</label>
              <input type="number" />
            </div>
            <div className={styles.buttonDiv}>
              <button className={styles.button}>Submit</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DescriptivePaperChecking;
