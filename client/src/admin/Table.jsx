import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import "../assets/css/table.css";
import axios from 'axios';

function ReportTable() {
  const [table, setTable] = useState([]);
  const [filteredTable, setFilteredTable] = useState([]); // State for filtered data
  const [selectedRating, setSelectedRating] = useState(''); // State for selected rating

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/user/getUsers`);
      setTable(response.data.data);
      setFilteredTable(response.data.data); // Set filteredTable initially to all data
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to filter table data based on selected rating
  const handleRatingChange = (event) => {
    const rating = event.target.value;
    setSelectedRating(rating);

    if (rating) {
      const filteredData = table.filter(item => item.performance === rating);
      setFilteredTable(filteredData);
    } else {
      setFilteredTable(table); // Reset to all data if no rating is selected
    }
  };

  return (
    <div>
      <div className="filter-container">
        <select className="report-dropdown" value={selectedRating} onChange={handleRatingChange}>
          <option value="">Select Rating</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      
      <Table striped>
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Mark</th>
            <th>Rating</th>
            <th>Performance Category</th>
            <th>Batch</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTable.length > 0 ? (
            filteredTable.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.score}</td>
                <td>{item.performance}</td>
                <td>{item.userStrength}</td>
                <td>{item.batch}</td>
                <td>{item.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default ReportTable;
