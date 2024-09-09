import React from 'react';



const Question = () => {
  return (
    
     

    <div className="container mt-5 pb-5 " >
      <form>
        {/* Question Type */}
        <div className="mb-4">
          <label htmlFor="type" className="form-label">Type</label>
          <select name="type" id="type" className="form-select">
            <option value="1">Technical</option>
            <option value="2">Non Technical</option>
          </select>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <label htmlFor="question" className="form-label">Question</label>
          <textarea
            name="question"
            id="question"
            className="form-control"
            rows="3"
            placeholder="Enter the question here"
          ></textarea>
        </div>

        {/* Options */}
        <div className="mb-4">
          <label className="form-label">Options</label>
          <div className="row">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Option A"
              />
            </div>
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Option B"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Option C"
              />
            </div>
            <div className="col-md-6 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Option D"
              />
            </div>
          </div>
        </div>

        {/* Correct Answer */}
        <div className="mb-4">
          <label htmlFor="correctAnswer" className="form-label">Correct Answer</label>
          <select name="correctAnswer" id="correctAnswer" className="form-select">
            <option value="1">A</option>
            <option value="2">B</option>
            <option value="3">C</option>
            <option value="4">D</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
    
  );
};

export default Question;
