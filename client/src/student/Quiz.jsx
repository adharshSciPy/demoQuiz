import React, { useState, useEffect } from 'react';
import '../assets/css/style.css';

const Quiz = () => {
  // State for the countdown timer (e.g., 10 seconds)
  const [timer, setTimer] = useState(60);

  // useEffect to handle the countdown
  useEffect(() => {
    // Set up a countdown timer
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(countdown); // Clear the timer when it reaches 0
          handleNext(); // Call the function to go to the next question
        }
        return prevTimer - 1;
      });
    }, 1000); // Update every second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(countdown);
  }, []);

  // Function to handle going to the next question
  const handleNext = () => {
    // Logic for moving to the next question, such as updating state, navigating to the next question, etc.
    console.log("Moving to the next question...");
    // You can add navigation logic here if needed
  };

  return (
    <div className="position-relative vh-100 d-flex align-items-center justify-content-center">
      <div className="w-75 p-4 bg-light border rounded shadow">
        <header className="mb-4 text-center">
          <h1 className="display-4">Quiz</h1>
          <p>Time remaining: {timer} seconds</p> {/* Display the timer */}
        </header>

        <main>
          <form>
            {/* Question */}
            <div className="mb-4 text-center">
              <h4>Question 1: What is the capital of France?</h4>
            </div>

            {/* Options */}
            <div className="mb-4 d-flex flex-column align-items-start lft">
              <div className="form-check d-flex align-items-center mb-2">
                <input className="form-check-input me-2" type="radio" name="options" id="option1" value="A" />
                <label className="form-check-label" htmlFor="option1">
                  Paris
                </label>
              </div>
              <div className="form-check d-flex align-items-center mb-2">
                <input className="form-check-input me-2" type="radio" name="options" id="option2" value="B" />
                <label className="form-check-label" htmlFor="option2">
                  London
                </label>
              </div>
              <div className="form-check d-flex align-items-center mb-2">
                <input className="form-check-input me-2" type="radio" name="options" id="option3" value="C" />
                <label className="form-check-label" htmlFor="option3">
                  Berlin
                </label>
              </div>
              <div className="form-check d-flex align-items-center mb-2">
                <input className="form-check-input me-2" type="radio" name="options" id="option4" value="D" />
                <label className="form-check-label" htmlFor="option4">
                  Madrid
                </label>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-secondary">Previous</button>
              <button type="button" className="btn btn-primary" onClick={handleNext}>Next</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Quiz;
