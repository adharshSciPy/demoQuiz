import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import "../assets/css/table.css";
import axios from 'axios';

function ReportTable() {
  const [table, setTable] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/user/getUsers`);
      setTable(response.data.data);
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Mark</th>
            <th>Rating</th>
            <th>Performance Category</th>
          </tr>
        </thead>
        <tbody>
          {table.length > 0 ? (
            table.map((item, index) => (
              <tr key={item.id}> {/* Make sure to use a unique key */}
                <td>{index + 1}</td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.score}</td>
                <td>{item.performance}</td>
                <td>{item.userStrength}</td>
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
  );
}

export default ReportTable;
