import React, { useState } from 'react';
import styles from './../assets/css/userMcqTable.module.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import axios from 'axios';

function UserMcqTable() {
    const[details,setDetails]=useState([]);
    
    const fetchSectionData=async()=>{
        try {
           const response=await axios.get(``) 
        } catch (error) {
            
        }
    }
  return (
    <div>
      <Navbar />
      <div className={styles.mainDiv}>
        <div className={styles.subDiv}>
          <h1 className={styles.userHead}>Akshay</h1>
          <div className={styles.detailsDiv}>
            <p>Section Name: Section One</p>
            <p>Start Time: 12:35</p>
            <p>End Time: 12:20</p>
          </div>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>SlNo</th>
                <th>Question</th>
                <th>Selected Option</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              <tr>
                <td>1</td>
                <td>What is 2+2?</td>
                <td>Option 1</td>
                <td>Skipped</td>
              </tr>
              <tr>
                <td>2</td>
                <td>What is the capital of France?</td>
                <td>Option 3</td>
                <td>Answered</td>
              </tr>
              <tr>
                <td>3</td>
                <td>What is the square root of 16?</td>
                <td>Option 2</td>
                <td>Answered</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Who wrote "Hamlet"?</td>
                <td>Option 4</td>
                <td>Skipped</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserMcqTable;
