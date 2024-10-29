import React, { useState } from 'react';
import styles from './../assets/css/session.module.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddSession from './AddSession';
import SessionModal from './SessionModal'; // Import SessionModal

function Session() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openDeleteModal = (sessionId) => {
    setSessionToDelete(sessionId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const handleDelete = () => {
    console.log(`Deleting session with ID: ${sessionToDelete}`);
    // Implement your delete functionality here
    closeDeleteModal();
  };

  return (
    <div>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.gridContainer}>
          <div className={styles.addSectionCard} onClick={openAddModal}>
            <FontAwesomeIcon className={styles.plusIcon} icon={faPlus} />
            <div className={styles.fontHead}>
              <h5>Add Session</h5>
            </div>
          </div>

          {/* List of Sessions */}
          {[1, 2, 3, 4].map((session, index) => (
            <div className={styles.sessionsListCard} key={index}>
              <div className={styles.fontHead}>
                <h5>Session {session}</h5>
                <p>16/2/2024</p>
                <h6>MCQ Questions</h6>
              </div>
              <FontAwesomeIcon
                className={styles.trashIcon}
                icon={faTrash}
                onClick={() => openDeleteModal(session)} // Open delete modal on click
              />
            </div>
          ))}
        </div>
      </div>

      {/* Add Session Modal */}
      {isAddModalOpen && (
        <AddSession onClose={closeAddModal} />
      )}

      {/* Delete Confirmation Modal */}
      <SessionModal
        isOpen={isDeleteModalOpen}
        onOk={handleDelete} // Pass the delete handler
        onCancel={closeDeleteModal} // Close modal on cancel
      />

      <Footer />
    </div>
  );
}

export default Session;
