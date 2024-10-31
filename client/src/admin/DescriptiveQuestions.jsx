import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import "../assets/css/table.css";
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import { DeleteOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';



function DescriptiveQuestions () {
    const [questions, setQuestions] = useState([]);
    const {sectionId}=useParams();

    const getQuestions = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/section/getsectionsbyid/${sectionId}`)
            console.log("admintable", response.data.data.Questions);
            setQuestions(response.data.data.Questions);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getQuestions();
    }, [])

    const deleteQuestions = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8000/api/v1/question/deletequestions/${id}`);
            console.log("deleted", response)
            getQuestions();
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Navbar />

            <Table striped>
                <thead>
                    <tr>
                        <th>Sl.No</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th>Mark</th>
                       
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length > 0 ? (
                        questions.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.question}</td>
                                
                                <td>{item.answer}</td>
                                <td>{item.mark}</td>
                                
                            
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteQuestions(item._id)}><DeleteOutlined /></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No data available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

        </div>
    )
}

export default DescriptiveQuestions;