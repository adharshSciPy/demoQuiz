import React, { useState } from 'react';
import styles from './../assets/css/session.module.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddSession from './AddSession'; // Import AddSession

function Session() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

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

          {[1, 2, 3, 4].map((session, index) => (
            <div className={styles.sessionsListCard} key={index}>
              <div className={styles.fontHead}>
                <h5>Session {session}</h5>
                <p>16/2/2024</p>
                <h6>MCQ Questions</h6>
              </div>
              <FontAwesomeIcon
                className={styles.TrashIcon}
                icon={faTrash}
                // Handle delete session logic
              />
            </div>
          ))}
        </div>
      </div>

      {isAddModalOpen && (
        <AddSession
          onClose={closeAddModal} // Function to close the modal
        />
      )}

      <Footer />
    </div>
  );
}

export default Session;
