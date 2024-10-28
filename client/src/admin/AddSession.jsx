import React, { useState } from 'react';
import styles from './../assets/css/addSession.module.css';

function AddSession({ onClose }) { // Accept onClose prop
  const [sessionName, setSessionName] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [questionType, setQuestionType] = useState('');

  const handleConfirm = () => {
    // Handle the confirmation logic here
    console.log('Session Name:', sessionName);
    console.log('Session Date:', sessionDate);
    console.log('Question Type:', questionType);
    
    // Reset the input fields
    setSessionName('');
    setSessionDate('');
    setQuestionType('');

    // Close the modal after confirming
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>Add New Session</div>
        <div className={styles.modalBody}>
          <input
            type="text"
            placeholder="Session Name"
            className={styles.inputField}
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
          <input
            type="date"
            className={styles.inputField}
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
          <select
            className={styles.inputField}
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="">Select Question Type</option>
            <option value="mcq">Multiple Choice Questions</option>
            
            <option value="shortAnswer">Short Answer Questions</option>
          </select>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.closeButton} onClick={onClose}>Cancel</button>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddSession;
