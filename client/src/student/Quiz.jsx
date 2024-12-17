import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/style.css";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../features/slice/authSlice";

const Quiz = ({ sectionId }) => {
  const { loggedInUserId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [disqualified, setDisqualified] = useState(false);



  const fetchQuestions = async () => {
    if (!sectionId) return;
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/section/getsectionsbyid/${sectionId}`
      );

      const shuffledQuestions = response.data.data.MCQ.sort(
        () => Math.random() - 0.5
      );
      setQuestions(shuffledQuestions);
      setHours(response.data.data.timer.hours);
      setMinutes(response.data.data.timer.minutes);
      setSeconds(response.data.data.timer.seconds);

      const initialAnswers = shuffledQuestions.map((q) => ({
        questionId: q._id,
        selectedOption: null,
      }));
      setSelectedAnswers(initialAnswers);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();

    if (!quizSubmitted) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") handleMalpractice();
      };
      const handleWindowBlur = () => handleMalpractice();

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleWindowBlur);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        window.removeEventListener("blur", handleWindowBlur);
      };
    }
  }, [quizSubmitted, sectionId]);

  const handleMalpractice = () => {
    if (!disqualified && !quizSubmitted) {
      setDisqualified(true);
      alert("You have been disqualified for malpractice.");
      handleSubmitQuiz(true);
      handleLogout();
    }
  };

  const handleLogout = () => {
    dispatch(setLogout());
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAnswerSelect = (option) => {
    const questionId = questions[currentQuestionIndex]._id;
    const optionKey = Object.keys(questions[currentQuestionIndex]).find(
      (key) => questions[currentQuestionIndex][key] === option
    );

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionId,
      selectedOption: optionKey || null,
    };
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmitQuiz = async (isDisqualified = false) => {
    try {
      const processedAnswers = selectedAnswers.map((answer) => ({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption || "skipped",
      }));

      await axios.patch(
        `http://localhost:8000/api/v1/user/quizsubmitmcq/${loggedInUserId}/${sectionId}`,
        {
          answers: processedAnswers,
          disqualified: isDisqualified,
        }
      );

      setQuizSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
    useEffect(() => {
      if (hours === 0 && minutes === 0 && seconds === 0 && !quizSubmitted) {
        handleSubmitQuiz();
        return;
      }
  
      const intervalId = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else if (minutes > 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else if (hours > 0) {
          setHours((prevHours) => prevHours - 1);
          setMinutes(59);
          setSeconds(59);
        }
      }, 1000);
  
      return () => clearInterval(intervalId);
    }, [hours, minutes, seconds, quizSubmitted]);
  
    const isLastMinute = hours === 0 && minutes === 0 && seconds <= 60;
  const handleCardClick = (index) => setCurrentQuestionIndex(index);

  return (
    <div className="mt-5 d-flex align-items-start justify-content-center">
    <aside
      className="sidebar bg-light p-3"
      style={{
        width: "20%",
        height: "80vh",
        overflowY: "auto", 
        borderRadius: "10px", 
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", 
      }}
    >
      <h5 className="mb-3" style={{ color: "#4a148c" }}>
        Questions
      </h5>
      <div className="row">
        {questions.map((_, index) => {
          const status = selectedAnswers[index]?.selectedOption
            ? "answered"
            : "unanswered";
  
          return (
            <div key={index} className="col-4 mb-3">
              <div
                className={`card p-2 text-center ${
                  status === "answered"
                    ? "bg-success text-white"
                    : status === "unanswered"
                    ? "bg-secondary text-white"
                    : "bg-warning"
                } ${currentQuestionIndex === index ? "border border-dark" : ""}`}
                style={{
                  cursor: "pointer",
                  borderRadius: "5px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adding box shadow to cards
                }}
                onClick={() => handleCardClick(index)}
              >
                Q{index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  
    <div
      className="w-75 p-4 bg-light border rounded shadow overflow-auto ms-4"
      style={{ height: "80vh" }}
    >
      <div className="quiz-container d-flex">
        {/* Main quiz area */}
        <main className="w-100 p-4">
          <h1 className="text-center mb-4" style={{ color: "#4a148c" }}>
            Quiz
          </h1>
  
          {quizSubmitted ? (
            <div className="text-center text-success">
              Quiz submitted successfully!
            </div>
          ) : (
            <>
              <div
                className="text-center mb-3"
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Box shadow for the question area
                }}
              >
                 <div className="timerMain">
                  <h6
                    className={`${'timerHead'} ${isLastMinute ? 'timerRed' : ''}`}
                  >
                    {hours}:{minutes < 10 ? `0${minutes}` : minutes}:
                    {seconds < 10 ? `0${seconds}` : seconds}
                  </h6>
                </div>
                <h4>
                  Question {currentQuestionIndex + 1}:{" "}
                  {questions[currentQuestionIndex]?.question}
                </h4>

                <div className="mb-4 d-flex flex-column align-items-start lft">
                  {Object.keys(questions[currentQuestionIndex] || {})
                    .filter((key) => key.startsWith("option"))
                    .map((optionKey, index) => (
                      <div key={index} className="form-check d-flex align-items-center mb-2">
                        <input
                          className="form-check-input me-2"
                          type="radio"
                          name="options"
                          id={`option${index}`}
                          checked={
                            selectedAnswers[currentQuestionIndex]?.selectedOption === optionKey
                          }
                          onChange={() =>
                            handleAnswerSelect(questions[currentQuestionIndex][optionKey])
                          }
                        />
                        <label className="form-check-label" htmlFor={`option${index}`}>
                          {questions[currentQuestionIndex][optionKey]}
                        </label>
                      </div>
                    ))}
                </div>
  
                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      currentQuestionIndex === questions.length - 1
                        ? handleSubmitQuiz()
                        : setCurrentQuestionIndex((prev) => prev + 1)
                    }
                  >
                    {currentQuestionIndex === questions.length - 1
                      ? "Submit"
                      : "Next"}
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  </div>
  
  
  );
};

export default Quiz;
