import React, { useState,useEffect } from 'react';
import styles from './../assets/css/userDescriptiveAnswerGet.module.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import axios from'axios'
import {useParams,useNavigate,useLocation} from 'react-router-dom'

function UserDescriptiveAnswerGet() {
    const[data,setData]=useState([]);
    const {userId}=useParams();
    const navigate=useNavigate();
    const location = useLocation();
    const { sectionDetails } = location.state || {};
    // console.log("section details",sectionDetails)
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
    const handleClick=(userId,sessionId,sectionId,answerId,questionId)=>{
        // console.log("userId",userId);
        // console.log("sessionId",sessionId);
        // console.log("section id",sectionId)
        navigate(`/descriptivepaper/${userId}/${sessionId}`,{
          state:{sectionDetails:sectionDetails,answerId:answerId,questionId:questionId}
        })
        
    }
  return (
    <div>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.subDiv}>
          <h1 className={styles.userHead}>User Descriptive Answer Table</h1>
          <div className={styles.detailsDiv}>
            <p>Section Name: Section One</p>
            <p>Start Time: 12:35(dummy)</p>
            <p>End Time: 12:20(dummy)</p>
          </div>
          <div className={styles.mainCard}>
  <div className={styles.cardContainer}>
    {data.map((session, sessionIndex) => (
      session.descriptiveAnswers.map((answer, answerIndex) => (
        <div className={styles.card} key={`${session._id}-${answerIndex}`}>
          <h4>Question {answerIndex + 1}</h4>
          <button className={styles.viewButton} onClick={()=>handleClick(userId,session._id,session.sectionId,answer._id,answer.questionId)}>View</button>
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
