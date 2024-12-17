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
        document.removeEventListener("visibilitychange", handleVisibilityChange);
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

    const updatedAnswers = [...selectedAnswers];

    // Unselect if the same option is clicked
    if (updatedAnswers[currentQuestionIndex].selectedOption === option) {
      updatedAnswers[currentQuestionIndex] = {
        questionId,
        selectedOption: null,
      };
    } else {
      const optionKey = Object.keys(questions[currentQuestionIndex]).find(
        (key) => questions[currentQuestionIndex][key] === option
      );
      updatedAnswers[currentQuestionIndex] = {
        questionId,
        selectedOption: optionKey || null,
      };
    }

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

  const handleCardClick = (index) => setCurrentQuestionIndex(index);

  return (
    <div className="quiz-container d-flex">
      {quizSubmitted ? (
        <div className="text-center text-success w-100">
          <h2>Quiz submitted successfully!</h2>
        </div>
      ) : (
        <>
          {/* Sidebar for question cards */}
          <aside className="sidebar bg-light p-3" style={{ width: "20%" }}>
            <h5 className="mb-3" style={{ color: "#4a148c" }}>Questions</h5>
            {questions.map((_, index) => {
              const status = selectedAnswers[index]?.selectedOption
                ? "answered"
                : "unanswered";

              return (
                <div
                  key={index}
                  className={`card mb-2 p-2 text-center ${
                    status === "answered"
                      ? "bg-success text-white"
                      : "bg-secondary text-white"
                  } ${currentQuestionIndex === index ? "border border-dark" : ""}`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  Q{index + 1}
                </div>
              );
            })}
          </aside>

          {/* Main quiz area */}
          <main className="w-75 p-4">
            <h1 className="text-center mb-4" style={{ color: "#4a148c" }}>
              Quiz
            </h1>

            <div className="text-center mb-3">
              <h4>
                Question {currentQuestionIndex + 1}:{" "}
                {questions[currentQuestionIndex]?.question}
              </h4>
            </div>

            <div className="mb-4">
  {Object.keys(questions[currentQuestionIndex] || {})
    .filter((key) => key.startsWith("option"))
    .map((optionKey, index) => (
      <div
        key={index}
        className="form-check mb-3 d-flex justify-content-center align-items-center"
        style={{ textAlign: "center" }}
      >
        <input
          className="form-check-input me-2"
          type="radio"
          name="options"
          id={`option${index}`}
          // style={{ transform: "scale(1.5)" }} // Enlarge the radio button
          checked={
            selectedAnswers[currentQuestionIndex]?.selectedOption === optionKey
          }
          onChange={() =>
            handleAnswerSelect(questions[currentQuestionIndex][optionKey])
          }
        />
        <label
          className="form-check-label"
          htmlFor={`option${index}`}
          style={{ fontSize: "1.1rem" }}
        >
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
          </main>
        </>
      )}
    </div>
  );
};

export default Quiz;
