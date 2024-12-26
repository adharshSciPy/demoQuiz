import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import "../assets/css/table.css";
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import { useNavigate } from "react-router-dom";

function ReportTable() {
  const [table, setTable] = useState([]);
  const [filteredTable, setFilteredTable] = useState([]);
  const [search, setSearch] = useState(""); 
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/user/getUsers`);
      setTable(response.data.data);
      setFilteredTable(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/user/getUsers`);
        setTable(response.data.data);
        // Apply the current filter to the new data
        const filteredData = response.data.data.filter((item) => {
          const name = item.fullName?.toLowerCase() || ""; 
          const email = item.email?.toLowerCase() || "";   
          return (
            name.includes(search.toLowerCase()) || email.includes(search.toLowerCase())
          );
        });
        setFilteredTable(filteredData);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
    const interval = setInterval(fetchData, 5000);
  
    return () => clearInterval(interval);
  }, [search]); // Add `search` as a dependency
  

  const handleStatus = async (id) => {
    try {
      const response = await axios.patch('http://localhost:8000/api/v1/admin/userstatuscontrol', { id });
      const updatedDetails = filteredTable.map((user) =>
        user._id === id ? { ...user, isEnabled: response.data.isEnabled } : user
      );
      setFilteredTable(updatedDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleClick = (id) => {
    navigate(`/userwisedetails/${id}`);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);
  
    if (!searchTerm) {
      // If search term is empty, reset the filtered table
      setFilteredTable(table);
      return;
    }
  
    const filteredData = table.filter((item) => {
      const name = item.fullName?.toLowerCase() || ""; // Safely access fullName
      const email = item.email?.toLowerCase() || "";   // Safely access email
      return name.includes(searchTerm) || email.includes(searchTerm);
    });
  
    setFilteredTable(filteredData);
  };

  const handleClearSearch = () => {
    setSearch("");
    setFilteredTable(table);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="search-container" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <div style={{ position: "relative", width: "300px" }}>
          <i
            className="fa fa-search"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1rem",
              color: "#999",
            }}
          ></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email"
            value={search}
            onChange={handleSearch}
            style={{
              width: "100%",
              padding: "10px 10px 10px 35px", // Add padding to the left to make space for the icon
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "1rem",
            }}
          />
          {search && (
            <i
              className="fa fa-times"
              onClick={handleClearSearch}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "1rem",
                color: "#999",
                cursor: "pointer",
              }}
            ></i>
          )}
        </div>
      </div>

      <Table striped>
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Batch</th>
            <th>Date</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredTable.length > 0 ? (
            filteredTable.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.batch}</td>
                <td>{formatDate(item.date)}</td>
                <td>
                  <button
                    className="btn-sm p-1"
                    style={{
                      width: '100px',
                      backgroundColor: '#4a148c',
                      color: "white",
                      borderRadius: '8px',
                      border: 'none',
                    }}
                    onClick={() => handleStatus(item._id)}
                  >
                    {item.isEnabled ? "Disable" : "Enable"}
                  </button>
                </td>
                <td>
                  <button
                    className="btn-sm p-1"
                    style={{
                      width: '100px',
                      backgroundColor: '#4a148c',
                      color: "white",
                      borderRadius: '8px',
                      border: 'none',
                    }}
                    onClick={() => handleClick(item._id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default ReportTable;
