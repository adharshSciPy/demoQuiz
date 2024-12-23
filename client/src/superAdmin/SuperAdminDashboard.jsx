import React, { useEffect, useState } from 'react';
import SuperAdminNav from './SuperAdminNav';
import styles from './SuperAdminDash.module.css';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function SuperAdminDashboard() {
  const [details, setDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/superadmin/getalladmins`);
      console.log("Admins list", response.data.response);
      setDetails(response.data.response);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatus = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/v1/superadmin/adminlogincontrol`, {
        id: id,
      });
      const updatedDetails = details.map((admin) =>
        admin._id === id ? { ...admin, isEnabled: response.data.admin.isEnabled } : admin
      );
      setDetails(updatedDetails);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDelete = async () => {
    setLoading(true); // Start loader
    try {
      // Simulate a 3-second delay
      setTimeout(async () => {
        const response = await axios.delete(`http://localhost:8000/api/v1/superadmin/deleteadmin`, { data: { id: deleteId } });
        const updatedDetails = details.filter((admin) => admin._id !== deleteId);
        setDetails(updatedDetails);
        setShowModal(false); // Close modal after deletion
        setLoading(false); // Stop loader
      }, 2000);
    } catch (error) {
      console.log("Error", error);
      setLoading(false); // Stop loader in case of error
    }
  };

  const openModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  return (
    <div>
      <SuperAdminNav />
      <div className={styles.main}>
        <Table striped>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeader}>Sl.No</th>
              <th className={styles.tableHeader}>Name</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Created At</th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item, index) => (
              <tr key={item._id} className={styles.tableCenter}>
                <td  className={`fs-6 ${styles.tableCenter}`}>{index + 1}</td>
                <td  className={`fs-6  ${styles.tableCenter}`}>{item.fullName}</td>
                <td  className={`fs-6 ${styles.tableCenter}`}>{item.email}</td>
                <td className={`fs-6 ${styles.tableCenter}`}>{item.date}</td>
                <td className={`fs-6 ${styles.tableCenter}`}>
                  <button
                    style={{
                      width: '100px',
                      backgroundColor: '#4a148c',
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      padding: '7px',
                    }}
                    onClick={() => handleStatus(item._id)}
                  >
                    {item.isEnabled ? "Disable" : "Enable"}
                  </button>
                </td>
                <td className={styles.tableCenter}>
                  <button
                    style={{
                      width: '100px',
                      backgroundColor: '#4a148c',
                      color: 'white',
                      borderRadius: '8px',
                      border: 'none',
                      padding: '7px',
                    }}
                    onClick={() => openModal(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal for delete confirmation */}
        <Modal show={showModal} onHide={closeModal} centered>
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
        </Modal>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
