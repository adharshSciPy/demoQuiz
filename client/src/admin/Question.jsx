import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { useParams,Link } from 'react-router-dom';
import { Breadcrumb } from "react-bootstrap";


const Question = () => {
  const { sectionId } = useParams();
  const [form, setForm] = useState({
    category: '',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctAns: ''
  });

  const notifySuccess = () => toast.success("Submitted Successfully!");
  const notifyError = (message = "Something Went Wrong!") => toast.error(message);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate form fields
    const { category, question, option1, option2, option3, option4, correctAns } = form;
    if (!category || !question || !option1 || !option2 || !option3 || !option4 || !correctAns) {
      notifyError("Please fill in all required fields");
      return;
    }

    const payload = {
      category,
      question,
      option1,
      option2,
      option3,
      option4,
      correctAns,

    };

    try {
      const response = await axios.put(`http://localhost:8000/api/v1/section/mcqsections/${sectionId}`, payload);
      if (response.status === 200) {
        notifySuccess();
        setForm({
          category: '',
          question: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          correctAns: ''
        });
      } else {
        notifyError();
      }
    } catch (error) {
      console.error("Error:", error);
      const message = error.response ? error.response.data : error.message;
      notifyError(message);
    }
  };

  return (
    <div
  style={{
    background: "linear-gradient(to top, #4a148c, #fff)",
    minHeight: "100vh"
  }}
>
      <Navbar />
      <Breadcrumb>
        <Breadcrumb.Item
          style={{
            fontWeight: "700",
            padding: "10px 15px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
            position: "relative",
            left: "20px",
            top: "20px",
            fontSize: "16px",
            boxShadow: "0 2px 5px rgba(70, 67, 67, 0.1)",
          }}
        >
          <Link
            to={`/session`}
            style={{
              textDecoration: "none",
              color: "#4a148c",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "16px",
            }}
          >
            Back
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="container mt-5 pb-5">
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
        />
        <form onSubmit={submitHandler}>
          {/* Question Type */}
          <div className="mb-4">
            <label htmlFor="type" className="form-label"style={{color:"white"}}>Type</label>
            <select
              name="category"
              id="type"
              className="form-select"
             
              value={form.category}
              onChange={handleInputChange}
            >
              <option value=""  >Select Type</option>
              <option value="Technical">Technical</option>
              <option value="NonTechnical">Non Technical</option>
            </select>
          </div>

          {/* Question Text */}
          <div className="mb-4">
            <label htmlFor="question" className="form-label"style={{color:"white"}}>Question</label>
            <textarea
              name="question"
              id="question"
              className="form-control"
              rows="3"
              placeholder="Enter the question here"
              value={form.question}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Options */}
          <div className="mb-4">
            <label className="form-label"style={{color:"white"}}>Options</label>
            <div className="row">
              <div className="col-md-6 mb-2">
                <input
                  name="option1"
                  type="text"
                  className="form-control"
                  placeholder="Option A"
                  value={form.option1}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  name="option2"
                  type="text"
                  className="form-control"
                  placeholder="Option B"
                  value={form.option2}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-2">
                <input
                  name="option3"
                  type="text"
                  className="form-control"
                  placeholder="Option C"
                  value={form.option3}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6 mb-2">
                <input
                  name="option4"
                  type="text"
                  className="form-control"
                  placeholder="Option D"
                  value={form.option4}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Correct Answer */}
          <div className="mb-4">
            <label htmlFor="correctAnswer" className="form-label"style={{color:"white"}}>Correct Answer</label>
            <select
              name="correctAns"
              id="correctAnswer"
              className="form-select"
              value={form.correctAns}
              onChange={handleInputChange}
            >
              <option value="">Select Correct Answer</option>
              <option value="option1">A</option>
              <option value="option2">B</option>
              <option value="option3">C</option>
              <option value="option4">D</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-secondary">
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Question;
