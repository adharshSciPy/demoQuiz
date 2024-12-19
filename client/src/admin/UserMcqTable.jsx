import React, { useEffect, useState } from "react";
import styles from "./../assets/css/userMcqTable.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import axios from "axios";
import { useParams, useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

function UserMcqTable() {
  const [details, setDetails] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [sectionName, setSectionName] = useState([]);
  const [performance, setPerformance] = useState("");
  const [score, setScore] = useState();

  const { userId, sessionId } = useParams();
  const location = useLocation();
  const { sectionDetails } = location.state || {};

  const fetchSectionData = async () => {
    try {
      // Fetch user-specific MCQ details
      const response = await axios.get(
        `http://localhost:8000/api/v1/user/getusermcqperfomance/${userId}/${sessionId}`
      );
      const questionDetails = response.data.data.sessionDetails.mcqAnswers;
      // console.log("question details response",response.data.data.sessionDetails)
      const performanceDetails = response.data.data;
      const scoreDetails = response.data.data.score;
      console.log("score details", scoreDetails);
      // console.log("perfomance details ghbhj",performanceDetails)
      setPerformance(performanceDetails.performance);

      setScore(scoreDetails);
      setDetails(questionDetails);

      // console.log("state",performance)
      // Fetch each question based on its questionId
      const questionPromises = questionDetails.map(async (item) => {
        const questionResponse = await axios.get(
          `http://localhost:8000/api/v1/user/getsinglemcqquestion/${sectionDetails.sectionId}`,
          { params: { questionId: item.questionId } } // Pass questionId as a query parameter
        );

        // Include the question text and status (isCorrect) in the final data
        return {
          ...item,
          question: questionResponse.data.data.question,
          isCorrect: item.isCorrect, // Preserve isCorrect from the original response
        };
      });

      const questionsWithText = await Promise.all(questionPromises);
      setQuestions(questionsWithText);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchSectionName = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/section/getsectionsbyid/${sectionDetails.sectionId}`
      );

      setSectionName(response.data.data.sectionName);
      console.log("response aaaaaaaaaaa", response.data);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchSectionData();
    fetchSectionName();
  }, []);

  const downloadCSV = () => {
    const headers = ["Sl.No", "Question", "Selected Option", "Status"];

    const csvRows = [];
    csvRows.push(`Performance: ${performance}`);
    csvRows.push(`Total Score: ${score}`);
    csvRows.push(" ");
    csvRows.push(headers.join(","));

    questions.forEach((item, index) => {
      const status =
        item.selectedOption === "skipped"
          ? "Skipped"
          : item.isCorrect
          ? "Correct"
          : "Incorrect";

      const row = [
        index + 1,
        `"${item.question}"`, // Wrap question in quotes to handle commas
        item.selectedOption,
        status,
      ];
      csvRows.push(row.join(",")); // Add row
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mcq_table_report.csv";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <Navbar />
      <Breadcrumb>
          <Breadcrumb.Item
            style={{
              fontWeight: "700",
              padding: "10px 15px",
              backgroundColor: "#f0f0f0",
              borderRadius: "5px",
              position:"relative",
              left:"20px",
              top:"20px",
              fontSize: "16px",
              boxShadow: "0 2px 5px rgba(70, 67, 67, 0.1)",
            }}
          >
            <Link
              to={`/userwisedetails/${userId}`}
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
      <div className={styles.mainDiv}>
       
        <div className={styles.subDiv}>
          <h1 className={styles.userHead}>User MCQ Table</h1>
          <div className={styles.mainDetailsDiv}>
            <div className={styles.detailsDiv}>
              <p>Section Name:{sectionName}</p>
            </div>
            <div className={styles.perfomanceDiv}>
              <h6>Perfomance:{performance}</h6>
              <p>Total Score:{score}</p>
            </div>
          </div>
          <button onClick={downloadCSV} className={styles.downloadButton}>
            Download CSV
          </button>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>SlNo</th>
                <th>Question</th>
                <th>Selected Option</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {questions.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.question}</td>
                  <td>{item.selectedOption}</td>
                  <td>
                    {item.selectedOption === "skipped"
                      ? "Skipped"
                      : item.isCorrect
                      ? "Correct"
                      : "InCorrect"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserMcqTable;
