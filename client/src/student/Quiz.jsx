import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/style.css';
import { useParams, useNavigate } from 'react-router-dom';

const Quiz = () => {
  const { loggedInUserId } = useParams();
  const navigate = useNavigate();

  // State for the countdown timer
  const [timer, setTimer] = useState(60);

  // State for the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // State to store questions fetched from the backend
  const [questions, setQuestions] = useState([]);

  // State to track the selected answers (initialized with null for skipped questions)
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  // State for the quiz submission status
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [disqualified, setDisqualified] = useState(false);

  // Fetch questions with pagination
  const fetchQuestions = async (page) => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/user/getQuestions', {
        params: {
          page: page,
          limit: 500, // Fetch all questions (or adjust limit if needed)
        },
      });
      // Shuffle the questions randomly
      const shuffledQuestions = response.data.data.questions.sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);

      // Initialize the selectedAnswers with null values for each question
      const initialAnswers = shuffledQuestions.map((q) => ({
        questionId: q._id,
        selectedOption: null, // Start as null, meaning unanswered/skipped
      }));
      setSelectedAnswers(initialAnswers);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    fetchQuestions(1); // Fetch page 1 on initial load

    // Only add event listeners if the quiz hasn't been submitted yet
    if (!quizSubmitted) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          handleMalpractice();
        }
      };

      const handleWindowBlur = () => {
        handleMalpractice();
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleWindowBlur);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('blur', handleWindowBlur);
      };
    }
  }, [quizSubmitted, disqualified]);

  const handleMalpractice = () => {
    if (!disqualified && !quizSubmitted) {
      setDisqualified(true);
      // alert('You have been disqualified from this quiz for switching tabs.');
      handleSubmitQuiz(true);
      navigate('/disqualified');
    }
  };

  // Reset the timer whenever the current question changes
  useEffect(() => {
    setTimer(60); // Reset timer to 60 seconds

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(countdown);
          if (currentQuestionIndex < questions.length - 1) {
            handleNext(); // Automatically move to the next question when timer reaches 0
          } else {
            handleSubmitQuiz(); // Automatically submit the quiz if it's the last question
          }
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown); // Clear the interval when component unmounts or question changes
  }, [currentQuestionIndex, questions.length]);

  // Handle answer selection
  const handleAnswerSelect = (option) => {
    const questionId = questions[currentQuestionIndex]._id;
    const optionKey = Object.keys(questions[currentQuestionIndex])
      .find(key => questions[currentQuestionIndex][key] === option);

    // Update the selected answer for the current question
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = { questionId, selectedOption: optionKey || null };
    setSelectedAnswers(updatedAnswers);
  };

  // Move to the next question or submit quiz
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  // Submit the quiz and send skipped questions as well
  const handleSubmitQuiz = async (isDisqualified = false) => {
    try {
      // Ensure that skipped questions (null values) are marked as "skipped"
      const processedAnswers = selectedAnswers.map(answer => ({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption || 'skipped',
      }));

      const response = await axios.patch(`http://localhost:8000/api/v1/user/quizSubmit/${loggedInUserId}`, {
        answers: processedAnswers,
        disqualified: isDisqualified,
      });

      console.log('Quiz submitted successfully:', response.data);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

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
            {/* Prevent accessing undefined question */}
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
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
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