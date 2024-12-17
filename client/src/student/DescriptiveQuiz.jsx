import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/style.css";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../features/slice/authSlice";

const DescriptiveQuiz = ({ sectionId }) => {
  const { loggedInUserId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setLogout());
    localStorage.removeItem("token");
    navigate("/");
  };

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
      const shuffledQuestions = response.data.data.Questions.sort(
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
    if (sectionId) fetchQuestions();

    if (!quizSubmitted) {
      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") handleMalpractice();
      };

      const handleWindowBlur = () => {
        handleMalpractice();
      };

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
  }, [quizSubmitted, disqualified, sectionId]);

  const handleMalpractice = () => {
    if (!disqualified && !quizSubmitted) {
      setDisqualified(true);
      alert("You have been disqualified from this quiz for Malpractice.");
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

  const insertSymbol = (symbol) => {
    const currentAnswer =
      selectedAnswers[currentQuestionIndex]?.writtenAnswer || "";
    handleAnswerSelect(currentAnswer + symbol);
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
      const processedAnswers = selectedAnswers.map((answer) => ({
        sectionId,
        questionId: answer.questionId,
        answerText: answer.writtenAnswer || "skipped",
      }));

      const response = await axios.post(
        `http://localhost:8000/api/v1/user/descriptivequizsubmit/${loggedInUserId}/${sectionId}`,
        {
          answers: processedAnswers,
          disqualified: isDisqualified,
        }
      );

      console.log("Quiz submitted successfully:", response.data);
      setQuizSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);

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
    // <div className="mt-5 d-flex align-items-center justify-content-center">
    //   <aside
    //     className="sidebar bg-light p-3"
    //     style={{
    //       width: "20%",
    //       height: "80vh",
    //       overflowY: "auto",
    //       borderRadius: "10px",
    //       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    //     }}
    //   >
    //     <h5 className="mb-3" style={{ color: "#4a148c" }}>
    //       Questions
    //     </h5>
    //     <div className="row">
    //       {questions.map((_, index) => {
    //         const isAnswered = selectedAnswers[index]?.writtenAnswer?.trim();
    //         const isCurrent = currentQuestionIndex === index;

    //         return (
    //           <div key={index} className="col-4 mb-3">
    //             <div
    //               className={`card p-2 text-center ${
    //                 isAnswered
    //                   ? "bg-success text-white"
    //                   : "bg-secondary text-white"
    //               } ${isCurrent ? "border border-dark" : ""}`}
    //               style={{
    //                 cursor: "pointer",
    //                 borderRadius: "5px",
    //                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adding box shadow to cards
    //               }}
    //               onClick={() => handleCardClick(index)}
    //             >
    //               Q{index + 1}
    //             </div>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </aside>
    //   <div className="w-75 p-4 bg-light border rounded shadow">
    //     <header className="mb-4 text-center">
    //       <h1 className="display-4" style={{ color: "#4a148c" }}>
    //         Quiz
    //       </h1>
    //       {quizSubmitted ? (
    //         <p className="text-success">Quiz submitted successfully!</p>
    //       ) : (
    //         <p></p>
    //       )}
    //     </header>

    //     <main>
    //       <form>
    //         {questions[currentQuestionIndex] && !quizSubmitted ? (
    //           <>
    //             <div className="timerMain">
    //               <h6
    //                 className={`${"timerHead"} ${
    //                   isLastMinute ? "timerRed" : ""
    //                 }`}
    //               >
    //                 {hours}:{minutes < 10 ? `0${minutes}` : minutes}:
    //                 {seconds < 10 ? `0${seconds}` : seconds}
    //               </h6>
    //             </div>
    //             <div className="mb-4 text-center">
    //               <h4>
    //                 Question {currentQuestionIndex + 1}:{" "}
    //                 {questions[currentQuestionIndex]?.question}
    //               </h4>
    //             </div>

    //             <div className="mb-4 d-flex flex-wrap gap-2">
    //               {/* Mathematical symbols toolbar */}
    //               {[
    //                 "π",
    //                 "√",
    //                 "^",
    //                 "∞",
    //                 "∑",
    //                 "∫",
    //                 "α",
    //                 "β",
    //                 "γ",
    //                 "δ",
    //                 "Δ",
    //                 "∂",
    //                 "θ",
    //                 "λ",
    //                 "μ",
    //                 "σ",
    //                 "Ω",
    //                 "Σ",
    //                 "∇",
    //               ].map((symbol) => (
    //                 <button
    //                   key={symbol}
    //                   type="button"
    //                   className="btn btn-outline-primary"
    //                   aria-label={`Insert ${symbol}`}
    //                   onClick={() => insertSymbol(symbol)}
    //                 >
    //                   {symbol}
    //                 </button>
    //               ))}
    //             </div>

    //             <div className="mb-4 d-flex flex-column align-items-start">
    //               <textarea
    //                 className="form-control h-100 "
    //                 placeholder="Write your answer here..."
    //                 value={
    //                   selectedAnswers[currentQuestionIndex]?.writtenAnswer || ""
    //                 }
    //                 onChange={(e) => handleAnswerSelect(e.target.value)}
    //                 rows="4"
    //               />
    //             </div>
    //           </>
    //         ) : quizSubmitted ? (
    //           <div className="text-center">
    //             Thank you for completing the quiz!
    //           </div>
    //         ) : (
    //           <div className="text-center">No more questions available.</div>
    //         )}

    //         {!quizSubmitted && (
    //           <div className="d-flex justify-content-between mt-4">
    //             <button
    //               type="button"
    //               style={{
    //                 backgroundColor: "#4a148c",
    //                 padding: "5px",
    //                 borderRadius: "5px",
    //                 border: "none",
    //                 color: "white",
    //                 width: "100px",
    //               }}
    //               onClick={() =>
    //                 setCurrentQuestionIndex(currentQuestionIndex - 1)
    //               }
    //               disabled={currentQuestionIndex === 0}
    //             >
    //               Previous
    //             </button>
    //             <button
    //               type="button"
    //               style={{
    //                 backgroundColor: "#4a148c",
    //                 padding: "5px",
    //                 borderRadius: "5px",
    //                 border: "none",
    //                 color: "white",
    //                 width: "100px",
    //               }}
    //               onClick={handleNext}
    //             >
    //               {currentQuestionIndex === questions.length - 1
    //                 ? "Submit"
    //                 : "Next"}
    //             </button>
    //           </div>
    //         )}
    //       </form>
    //     </main>
    //   </div>
    // </div>


    <div
  className="d-flex justify-content-center align-items-start mt-5"
  style={{ height: "85vh", gap: "20px" }} // Ensure vertical alignment and spacing
>
  {/* Sidebar */}
  <aside
    className="sidebar bg-light p-3"
    style={{
      width: "20%",
      height: "100%",
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
        const isAnswered = selectedAnswers[index]?.writtenAnswer?.trim();
        const isCurrent = currentQuestionIndex === index;

        return (
          <div key={index} className="col-4 mb-3">
            <div
              className={`card p-2 text-center ${
                isAnswered
                  ? "bg-success text-white"
                  : "bg-secondary text-white"
              } ${isCurrent ? "border border-dark" : ""}`}
              style={{
                cursor: "pointer",
                borderRadius: "5px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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

  {/* Main Content */}
  <div
    className="flex-grow-1 bg-light p-4 border rounded shadow"
    style={{
      height: "100%",
      overflowY: "auto", // To manage large question text
    }}
  >
    <header className="mb-4 text-center">
      <h1 className="display-4" style={{ color: "#4a148c" }}>
        Quiz
      </h1>
      {quizSubmitted ? (
        <p className="text-success">Quiz submitted successfully!</p>
      ) : null}
    </header>

    <main>
      <form>
        {questions[currentQuestionIndex] && !quizSubmitted ? (
          <>
            <div className="timerMain mb-3 text-center">
              <h6
                className={`${"timerHead"} ${
                  isLastMinute ? "timerRed" : ""
                }`}
              >
                {hours}:{minutes < 10 ? `0${minutes}` : minutes}:
                {seconds < 10 ? `0${seconds}` : seconds}
              </h6>
            </div>
            <div className="mb-4 text-center">
              <h4>
                Question {currentQuestionIndex + 1}:{" "}
                {questions[currentQuestionIndex]?.question}
              </h4>
            </div>

            <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
              {/* Mathematical symbols toolbar */}
              {[
                "π",
                "√",
                "^",
                "∞",
                "∑",
                "∫",
                "α",
                "β",
                "γ",
                "δ",
                "Δ",
                "∂",
                "θ",
                "λ",
                "μ",
                "σ",
                "Ω",
                "Σ",
                "∇",
              ].map((symbol) => (
                <button
                  key={symbol}
                  type="button"
                  className="btn btn-outline-primary"
                  aria-label={`Insert ${symbol}`}
                  onClick={() => insertSymbol(symbol)}
                >
                  {symbol}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <textarea
                className="form-control"
                placeholder="Write your answer here..."
                value={
                  selectedAnswers[currentQuestionIndex]?.writtenAnswer || ""
                }
                onChange={(e) => handleAnswerSelect(e.target.value)}
                rows="4"
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
              onClick={() =>
                setCurrentQuestionIndex(currentQuestionIndex - 1)
              }
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
            >
              {currentQuestionIndex === questions.length - 1
                ? "Submit"
                : "Next"}
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
