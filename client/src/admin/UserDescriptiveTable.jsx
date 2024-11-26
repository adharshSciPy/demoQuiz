import React ,{useState,useEffect}from 'react'
import styles from './../assets/css/userDescriptiveTable.module.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

function UserDescriptiveTable() {
    const [details, setDetails] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [sectionName,setSectionName]=useState([]);
    const[score,setScore]=useState('')
    const { userId, sessionId } = useParams();
    const location = useLocation();
    const { sectionDetails } = location.state || {};

    const fetchSectionData = async () => {
        try {
            // Fetch user-specific descriptive details
            const response = await axios.get(`http://localhost:8000/api/v1/user/getuserdescriptiveperfomance/${userId}/${sessionId}`);
            const questionDetails = response.data.data.sessionDetails.descriptiveAnswers;
            // console.log("question details",questionDetails)
            const score=response.data.data.score;
            // console.log("perfo",score)
            setDetails(questionDetails);
            setScore(score)
            // console.log("question details",questionDetails)
            
           

            // Fetch each question based on its questionId
            const questionPromises = questionDetails.map(async (item) => {
                const questionResponse = await axios.get(
                    `http://localhost:8000/api/v1/user/getsingledescriptivequestion/${sectionDetails.sectionId}`,
                    { params: { questionId: item.questionId } } // Pass questionId as a query parameter
                );
                
                // Include the question text and status (isCorrect) in the final data
                // console.log("question response",questionResponse)
                return { 
                    ...item, 
                    question: questionResponse.data.data.question, 
                    totalMark:questionResponse.data.data.mark,
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
    }, []); // Empty dependency array to ensure it runs only once on mount
    
    // console.log("haiiiiiii",details)
    // console.log("hellllooo",questions)
    return (
        <div>
            <Navbar/>
            <div className={styles.mainDiv}>
                <div className={styles.subDiv}>
                    {/* <h1 className={styles.userHead}>User Descriptive Table</h1> */}
                    <div className={styles.mainDetailsDiv}>
                    <div className={styles.detailsDiv}>
                        <p>Section Name: {sectionName}</p>
                        {/* <p>Start Time: 12:35</p>
                        <p>End Time: 12:20</p> */}
                    </div>
                    <div className={styles.totalScoreDiv}>
                        <h6 className={styles.totalScore}>Total Score:{score}</h6>
                    </div>
                    </div>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th>SlNo</th>
                                <th>Question</th>
                                <th>Mark Obtained</th>
                                <th>Total Mark</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {questions.map((item,index)=>(
                            
                                
                                <tr key={index} >
                                    <td>{index+1}</td>
                                    <td>{item.question}</td>
                                    <td>{item.markObtained}</td>
                                    <td>{item.totalMark}</td>
                                    <td>{(item.answerText!=="skipped")?"Answered":"Skipped"}</td>
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

export default UserDescriptiveTable
