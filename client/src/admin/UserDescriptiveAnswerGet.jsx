import React, { useState,useEffect } from 'react';
import styles from './../assets/css/userDescriptiveAnswerGet.module.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import axios from'axios'
import {useParams} from 'react-router-dom'

function UserDescriptiveAnswerGet() {
    const[data,setData]=useState([]);
    const {userId}=useParams();
    const fetchDescriptiveData=async()=>{
        const response= await axios.get(`http://localhost:8000/api/v1/admin/getdescriptiveAnswerfromUser`,{
           params:{ userId:userId},
        });
        // console.log("response",response.data.descriptiveSessions)
        setData(response.data.descriptiveSessions);
    }
    useEffect(()=>{
        fetchDescriptiveData()
        
    },[data])
    const handleClick=(sessionId)=>{
        console.log("sessionId",sessionId)
    }
  return (
    <div>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.subDiv}>
          <h1 className={styles.userHead}>User Descriptive Answer Table</h1>
          <div className={styles.detailsDiv}>
            <p>Section Name: Section One</p>
            <p>Start Time: 12:35</p>
            <p>End Time: 12:20</p>
          </div>
          <div className={styles.mainCard}>
  <div className={styles.cardContainer}>
    {data.map((session, sessionIndex) => (
      session.descriptiveAnswers.map((answer, answerIndex) => (
        <div className={styles.card} key={`${session._id}-${answerIndex}`}>
          <h4>Question {answerIndex + 1}</h4>
          <button className={styles.viewButton} onClick={()=>handleClick(session._id)}>View</button>
        </div>
      ))
    ))}
  </div>
</div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserDescriptiveAnswerGet;
