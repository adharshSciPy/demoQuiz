import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "../assets/css/table.css";
import axios from "axios";
import Navbar from "../navbar/Navbar";
import { DeleteOutlined } from "@ant-design/icons";
import { useParams,Link } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";


function AdminTable() {
  const [questions, setQuestions] = useState([]);
  const { sectionId } = useParams();

  const getQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/section/getsectionsbyid/${sectionId}`
      );
      console.log("admintable", response.data.data.MCQ);
      setQuestions(response.data.data.MCQ);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const deleteQuestions = async (id) => {
    console.log(id);
    console.log("sectionId:", sectionId);

    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/section/deletesectionmcq/${sectionId}`,
        { id: id }
      );
      console.log(response);
      getQuestions();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="main">
      
      <Navbar />
      <Breadcrumb>
        <Breadcrumb.Item
          style={{
            fontWeight: "700",
            padding: "10px 15px",
            backgroundColor: "#f0f0f0",
            borderRadius: "5px",
            position: "relative",
            left: "2px",
            top: "20px",
            fontSize: "16px",
            marginBottom:"15px",
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
<div className="tableMain">
      <Table striped>
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Question</th>
            <th>Option1</th>
            <th>Option2</th>
            <th>Option3</th>
            <th>Option4</th>
            <th>Answer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.length > 0 ? (
            questions.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.question}</td>
                <td>{item.option1}</td>
                <td>{item.option2}</td>
                <td>{item.option3}</td>
                <td>{item.option4}</td>
                <td>{item.correctAns}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteQuestions(item._id)}
                  >
                    <DeleteOutlined />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      </div>
    </div>
  );
}

export default AdminTable;
