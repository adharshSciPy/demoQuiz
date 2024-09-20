import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/style.css';
import { useParams } from 'react-router-dom';

const Quiz = () => {
  const { loggedInUserId } = useParams();
  
  // State for the countdown timer
  const [timer, setTimer] = useState(60);

  // State for the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // State to store questions fetched from the backend
  const [questions, setQuestions] = useState([]);

  // State to track the selected answers
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  // State for the quiz submission status
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/user/getQuestions');
        setQuestions(response.data.data.questions);
        console.log("Fetched questions:", response.data.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  // Reset the timer whenever the current question changes
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
  }, [currentQuestionIndex]);

  // Function to handle going to the next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  // Function to handle answer selection
  const handleAnswerSelect = (option) => {
    const questionId = questions[currentQuestionIndex]._id; // Assuming each question has a unique _id
    const optionKey = Object.keys(questions[currentQuestionIndex])
    .find(key => questions[currentQuestionIndex][key] === option);

    // Store the selected answer for the current question
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = { questionId, selectedOption: optionKey };
    setSelectedAnswers(updatedAnswers);
  };

  // Function to submit the quiz
  const handleSubmitQuiz = async () => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/v1/user/quizSubmit/${loggedInUserId}`, {
        answers: selectedAnswers,
      });
      console.log("Quiz submitted successfully:", response.data);
      setQuizSubmitted(true); // Set the quiz submission status to true
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  // const getOptionsArray = (question) => {
  //   return Object.values(question).filter((value, index) => index >= 1 && value !== question.question);
  // };

  return (
    <div className="mt-5 d-flex align-items-center justify-content-center">
      <div className="w-75 p-4 bg-light border rounded shadow">
        <header className="mb-4 text-center">
          <h1 className="display-4">Quiz</h1>
          {quizSubmitted ? (
            <p className="text-success">Quiz submitted successfully!</p>
          ) : (
            <p>Time remaining: {timer} seconds</p>
          )}
        </header>

        <main>
          <form>
            {/* Conditional rendering to prevent accessing undefined question */}
            {questions[currentQuestionIndex] && !quizSubmitted ? (
              <>
                {/* Question */}
                <div className="mb-4 text-center">
                  <h4>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]?.question}</h4>
                </div>

                {/* Options */}
                <div className="mb-4 d-flex flex-column align-items-start lft">
                {Object.keys(questions[currentQuestionIndex]).filter(key => key.startsWith('option')).map((optionKey, index) => (
                    <div className="form-check d-flex align-items-center mb-2" key={index}>
                      <input
                        className="form-check-input me-2"
                        type="radio"
                        name="options"
                        id={`option${index}`}
                        value={questions[currentQuestionIndex][optionKey]}
                        checked={selectedAnswers[currentQuestionIndex]?.selectedOption === optionKey}
                        onChange={() => handleAnswerSelect(questions[currentQuestionIndex][optionKey])}
                      />
                      <label className="form-check-label" htmlFor={`option${index}`}>
                      {questions[currentQuestionIndex][optionKey]}
                      </label>
                    </div>
                  ))}
                </div>
              </>
            ) : quizSubmitted ? (
              <div className="text-center">Thank you for completing the quiz!</div>
            ) : (
              <div className="text-center">No more questions available.</div>
            )}

            {/* Navigation Buttons */}
            {!quizSubmitted && (
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                  disabled
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
                </button>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
};

export default Quiz;
