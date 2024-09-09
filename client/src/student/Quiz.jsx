import React, { useState, useEffect } from 'react';
import '../assets/css/style.css';

const Quiz = () => {
  // State for the countdown timer (e.g., 60 seconds)
  const [timer, setTimer] = useState(60);
  
  // State for the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // State to track the questions that have been answered
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  // State for the selected answer
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Array of questions with options
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Paris", "London", "Berlin", "Madrid"],
    },
    {
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["William Shakespeare", "Charles Dickens", "Mark Twain", "Jane Austen"],
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Oxygen", "Gold", "Iron", "Zinc"],
    },
  ];

  // useEffect to handle the countdown, runs whenever currentQuestionIndex changes
  useEffect(() => {
    // Reset the timer to 60 seconds when a new question loads
    setTimer(60);

    // Set up a countdown timer
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(countdown); // Clear the timer when it reaches 0
          handleNext(); // Automatically go to the next question
        }
        return prevTimer - 1;
      });
    }, 1000); // Update every second

    // Cleanup the interval when the component unmounts or currentQuestionIndex changes
    return () => clearInterval(countdown);
  }, [currentQuestionIndex]); // Re-run the effect when currentQuestionIndex changes

  // Function to handle going to the next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Mark the current question as answered
      setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);

      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      // Clear the selected answer for the next question
      setSelectedAnswer(null);
    }
  };

  // Function to handle answer selection
  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  return (
    <div className="mt-5 d-flex align-items-center justify-content-center">
      <div className="w-75 p-4 bg-light border rounded shadow">
        <header className="mb-4 text-center">
          <h1 className="display-4">Quiz</h1>
          <p>Time remaining: {timer} seconds</p> {/* Display the timer */}
        </header>

        <main>
          <form>
            {/* Conditional rendering to prevent accessing undefined question */}
            {questions[currentQuestionIndex] ? (
              <>
                {/* Question */}
                <div className="mb-4 text-center">
                  <h4>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex].question}</h4>
                </div>

                {/* Options */}
                <div className="mb-4 d-flex flex-column align-items-start lft">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <div className="form-check d-flex align-items-center mb-2" key={index}>
                      <input
                        className="form-check-input me-2"
                        type="radio"
                        name="options"
                        id={`option${index}`}
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={() => handleAnswerSelect(option)}
                      />
                      <label className="form-check-label" htmlFor={`option${index}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center">No more questions available.</div>
            )}

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              {/* Disable Previous Button if the question has been answered */}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                disabled={answeredQuestions.includes(currentQuestionIndex - 1) || currentQuestionIndex === 0}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Quiz;
