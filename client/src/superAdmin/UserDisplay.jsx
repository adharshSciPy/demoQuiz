import React, { useEffect, useState } from 'react'
import SuperAdminNav from './SuperAdminNav';
import Table from 'react-bootstrap/Table';
// import Modal from 'react-bootstrap/Modal';

import styles from './SuperAdminDash.module.css';
import axios from 'axios';


function UserDisplay() {
  const[userDetails,SetUserDetails]=useState([]);
  const getAllUsers=async()=>{
    try {
      const response=await axios.get(`http://localhost:8000/api/v1/user/getUsers`);
      // console.log("User details",response.data.data);
      
      SetUserDetails(response.data.data);
    } catch (error) {
      console.log("Error", error);
      
    }

  }
  useEffect(()=>{
    getAllUsers()
  },[])
  const formatDate=(inputDate)=>{
    const date=new Date(inputDate)
    const day=String(date.getDate()).padStart(2,'0')
    const month=String(date.getMonth()+1).padStart(2,'0')
    const year=date.getFullYear()
    return `${day}-${month}-${year}`
  }
  return (
    <div>
      <SuperAdminNav />
      <div className={styles.main}>
        <Table striped>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeader}>Sl.No</th>
              <th className={styles.tableHeader}>User Name</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Created At</th>
              <th className={styles.tableHeader}>Phone No</th>
              <th className={styles.tableHeader}>Activity Status</th>
            </tr>
          </thead>
          <tbody>
            {userDetails.map((item,index)=>(

          
              <tr key={item.id} className={styles.tableCenter}>
                <td  className={`fs-6 ${styles.tableCenter}`}>{index+1}</td>
                <td  className={`fs-6  ${styles.tableCenter}`}>{item.fullName}</td>
                <td  className={`fs-6 ${styles.tableCenter}`}>{item.email}</td>
                <td className={`fs-6 ${styles.tableCenter}`}>{formatDate(item.date)}</td>
                <td className={`fs-6 ${styles.tableCenter}`}>{item.phone?item.phone:"N/A"}</td>
                <td className={styles.tableCenter} style={{ color: item.isEnabled ? "green" : "red" }}>
                    {item.isEnabled ? "Active" : "Inactive"}
                </td>
              </tr>
          ))}
          </tbody>
        </Table>

        {/* Modal for delete confirmation */}
        {/* <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Deleting, please wait...</p>
              </div>
            ) : (
              "Are you sure you want to delete this admin?"
            )}
          </Modal.Body>
          <Modal.Footer>
            {!loading && (
              <>
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal> */}
      </div>
      
    </div>
  )
}

export default UserDisplay
