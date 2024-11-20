import React, { useEffect, useState } from 'react';
import styles from './../assets/css/userMcqTable.module.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

function UserMcqTable() {
    const [details, setDetails] = useState([]);
    const [questions, setQuestions] = useState([]);
    const[sectionName,setSectionName]=useState([])
    const { userId, sessionId } = useParams();
    const location = useLocation();
    const { sectionDetails } = location.state || {};

    const fetchSectionData = async () => {
        try {
            // Fetch user-specific MCQ details
            const response = await axios.get(`http://localhost:8000/api/v1/user/getuserwisemcq/${userId}/${sessionId}`);
            const questionDetails = response.data.data;
            setDetails(questionDetails);

            // Fetch each question based on its questionId
            const questionPromises = questionDetails.map(async (item) => {
                const questionResponse = await axios.get(
                    `http://localhost:8000/api/v1/user/getsinglemcqquestion/${sectionDetails.sectionId}`,
                    { params: { questionId: item.questionId } } // Pass questionId as a query parameter
                );

                // Include the question text and status (isCorrect) in the final data
                return { 
                    ...item, 
                    question: questionResponse.data.data.question, 
                    isCorrect: item.isCorrect // Preserve isCorrect from the original response
                };
             
            });
            

            const questionsWithText = await Promise.all(questionPromises);
            setQuestions(questionsWithText);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const fetchSectionName=async()=>{
        try {
            const response=await axios.get(`http://localhost:8000/api/v1/section/getsectionsbyid/${sectionDetails.sectionId}`)
            
            setSectionName(response.data.data.sectionName);
            console.log("response for section name",response.data.data.sectionName)

        } catch (error) {
            console.log("Error",error)
        }
    }

    useEffect(() => {
        fetchSectionData();
        fetchSectionName();
    }, []);

    return (
        <div>
            <Navbar />
            <div className={styles.mainDiv}>
                <div className={styles.subDiv}>
                    <h1 className={styles.userHead}>User MCQ Table</h1>
                    <div className={styles.detailsDiv}>
                        <p>Section Name:{sectionName}</p>
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
                            {questions.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.question}</td>
                                    <td>{item.selectedOption}</td>
                                    <td>{item.selectedOption==="skipped"?"Skipped":item.isCorrect?"Correct":"InCorrect"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UserMcqTable;
