import React from 'react';
import '../assets/css/style.css'
const Quiz = () => {
  return (
    <div className="position-relative vh-100 d-flex align-items-center justify-content-center">
      <div className="w-75 p-4 bg-light border rounded shadow">
        <header className="mb-4 text-center">
          <h1 className="display-4">Quiz: General Knowledge</h1>
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
              <button type="button" className="btn btn-primary">Next</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Quiz;
