import React, { useState } from 'react';
import NavbarStudent from '../navbar/NavbarStudent';

import '../assets/css/adminPage.css';
import Quiz from './Quiz';
import Instructions from './Instructions';

function StudentPage() {
  const [startQuiz, setStartQuiz] = useState(false);

  // Function to handle starting the quiz
  const handleStartQuiz = () => {
    setStartQuiz(true); // Set state to true to switch to the Quiz component
  };

  return (
    <div className="main">
      <NavbarStudent />
      {startQuiz ? (
        <Quiz />  // Render the Quiz component if startQuiz is true
      ) : (
        <Instructions onStartQuiz={handleStartQuiz} />  // Render Instructions by default
      )}
    
      <footer className="foote1r"  style={{
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '8px',
    textAlign: 'center',
    color: 'white',
    fontSize: '14px',
    marginTop: '2rem',
    
    width: '100vw',
    
  }}>
            <div className="right-panel">
          Scipy Technologies &copy; 2024
        </div>
            </footer>
    </div>
  );
}

export default StudentPage;
