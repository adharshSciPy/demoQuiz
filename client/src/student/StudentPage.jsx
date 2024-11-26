import React, { useState, useEffect } from 'react';
import NavbarStudent from '../navbar/NavbarStudent';
import '../assets/css/adminPage.css';
import Quiz from './Quiz';
import DescriptiveQuiz from './DescriptiveQuiz';
import axios from 'axios';
import Instructions from './Instructions';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // Import useParams to access userId from URL

function StudentPage() {
  const { loggedInUserId } = useParams(); // Get userId from the route parameter
  const [startQuiz, setStartQuiz] = useState(false);
  const [sectionId, setSectionId] = useState(null);
  const [questionType, setQuestionType] = useState(null);
  
  const notifyError = (message) => toast.error(message);//to set the toast error

  const handleStartQuiz = async () => {
    try {
      // Get section data (for the example, assume the first section from the API response)
      const response = await axios.get(`http://localhost:8000/api/v1/section/getquizsection`);
      const sectionData = response.data.data[0];
      const { sectionId, questionType } = sectionData;

      setSectionId(sectionId);
      setQuestionType(questionType);

      // Check if the user is allowed to take this quiz section
      const checkResponse = await axios.get(
        `http://localhost:8000/api/v1/user/checkuserquizsubmit/${loggedInUserId}/${sectionId}`
      );

      const { attempted, disqualified, message } = checkResponse.data;
      console.log("check response",checkResponse.data)
      if (attempted||disqualified) {
        notifyError(message); // Set error message if user already attempted/disqualified
        setStartQuiz(false); // Prevent starting quiz
      } else {
        setStartQuiz(true); // Allow user to start the quiz
      }
    } catch (error) {
      console.error('Error fetching section data or user status:', error);
      notifyError('There was an issue retrieving quiz information.');
    }
  };

  return (
    <div className="main">
       <ToastContainer position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover />
      <NavbarStudent />
      
      {startQuiz ? (
        questionType === "MCQ" ? (
          <Quiz sectionId={sectionId} />
        ) : (
          <DescriptiveQuiz sectionId={sectionId} />
        )
      ) : (
        <Instructions onStartQuiz={handleStartQuiz} />
      )}

      {/* <footer className="footer">
        <div className="right-panel">Scipy Technologies &copy; 2024</div>
      </footer> */}
    </div>
  );
}

export default StudentPage;
