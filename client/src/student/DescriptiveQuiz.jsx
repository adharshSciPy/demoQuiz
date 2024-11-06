import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/style.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogout } from '../features/slice/authSlice';

const DescriptiveQuiz = ({sectionId}) => {
  const { loggedInUserId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setLogout()); // Dispatch the logout action
    localStorage.removeItem('token'); // Remove the token from local storage
    navigate('/'); // Redirect to the admin login page
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [disqualified, setDisqualified] = useState(false);

  const fetchQuestions = async () => {
    if (!sectionId) return;
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/section/getsectionsbyid/${sectionId}`);
      console.log("response from axios ",response)
      const shuffledQuestions = response.data.data.Questions.sort(() => Math.random() - 0.5);
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
    if(sectionId){
    fetchQuestions(); // Fetch questions when the component mounts
    }
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
  }, [quizSubmitted, disqualified, sectionId]);

  const handleMalpractice = () => {
    if (!disqualified && !quizSubmitted) {
      setDisqualified(true);
      alert('You have been disqualified from this quiz for Malpractice.');
      handleSubmitQuiz(true);
      handleLogout();
    }
  };

  const handleAnswerSelect = (answer) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = {
      ...updatedAnswers[currentQuestionIndex],
      writtenAnswer: answer,
    };
    setSelectedAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async (isDisqualified = false) => {
    try {
      const processedAnswers = selectedAnswers.map(answer => ({
        questionId: answer.questionId,
        writtenAnswer: answer.writtenAnswer || 'skipped',
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

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (hours === 0 && minutes === 0 && seconds === 0 && !quizSubmitted) {
      handleSubmitQuiz();
      return;
    }

    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds(prevSeconds => prevSeconds - 1);
      } else if (minutes > 0) {
        setMinutes(prevMinutes => prevMinutes - 1);
        setSeconds(59);
      } else if (hours > 0) {
        setHours(prevHours => prevHours - 1);
        setMinutes(59);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [hours, minutes, seconds, quizSubmitted]);

  const isLastMinute = hours === 0 && minutes === 0 && seconds <= 60;

  return (
    <div className="mt-5 d-flex align-items-center justify-content-center">
      <div className="w-75 p-4 bg-light border rounded shadow">
        <header className="mb-4 text-center">
          <h1 className="display-4">Quiz</h1>
          {quizSubmitted ? (
            <p className="text-success">Quiz submitted successfully!</p>
          ) : (
            <p></p>
          )}
        </header>

        <main>
          <form>
            {questions[currentQuestionIndex] && !quizSubmitted ? (
              <>
                <div className='timerMain'>
                  <h6 className={`${'timerHead'} ${isLastMinute ? 'timerRed' : ''}`}>
                    {hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </h6>
                </div>
                <div className="mb-4 text-center">
                  <h4>Question {currentQuestionIndex + 1}: {questions[currentQuestionIndex]?.question}</h4>
                </div>

                <div className="mb-4 d-flex flex-column align-items-start">
                  <textarea
                    className="form-control h-100 "
                    placeholder="Write your answer here..."
                    value={selectedAnswers[currentQuestionIndex]?.writtenAnswer || ""}
                    onChange={(e) => handleAnswerSelect(e.target.value)}
                    rows='4'
                  />
                </div>
              </>
            ) : quizSubmitted ? (
              <div className="text-center">Thank you for completing the quiz!</div>
            ) : (
              <div className="text-center">No more questions available.</div>
            )}

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

export default DescriptiveQuiz;
