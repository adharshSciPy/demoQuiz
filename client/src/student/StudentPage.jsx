import React, { useState, useEffect } from 'react';
import NavbarStudent from '../navbar/NavbarStudent';
import '../assets/css/adminPage.css';
import Quiz from './Quiz';
import DescriptiveQuiz from './DescriptiveQuiz'; // Import DescriptiveQuiz component
import axios from 'axios';
import Instructions from './Instructions'

function StudentPage() {
  const [startQuiz, setStartQuiz] = useState(false);
  const [sectionId, setSectionId] = useState(null);
  const [questionType, setQuestionType] = useState(null);

  // Function to handle starting the quiz
  const handleStartQuiz = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/section/getquizsection`);
      
      // Assuming response.data.data is an array and you want the first element
      const sectionData = response.data.data[0]; // Access the first element
      const { sectionId, questionType } = sectionData; // Destructure sectionId and questionType
  
      setSectionId(sectionId); // Store the section ID in state
      setQuestionType(questionType); // Store the question type in state
      setStartQuiz(true); // Set state to true to switch to the quiz component
      console.log("section id on state", sectionId);
      console.log("Question type on state", questionType);
      
    } catch (error) {
      console.error('Error fetching section data:', error);
    }
  };
  

  return (
    <div className="main">
      <NavbarStudent />
      {startQuiz ? (
        questionType === "MCQ" ? ( // Conditional rendering based on question type
          <Quiz sectionId={sectionId} /> // Pass sectionId as a prop to Quiz
        ) : (
          <DescriptiveQuiz sectionId={sectionId} /> // Pass sectionId as a prop to DescriptiveQuiz
        )
      ) : (
        <Instructions onStartQuiz={handleStartQuiz} /> // Render Instructions by default
      )}

      <footer className="footer">
        <div className="right-panel">
          Scipy Technologies &copy; 2024
        </div>
      </footer>
    </div>
  );
}

export default StudentPage;
