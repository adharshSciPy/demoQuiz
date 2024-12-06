import React, { useState, useEffect } from 'react';
import styles from './../assets/css/session.module.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPen, faEye } from '@fortawesome/free-solid-svg-icons';
import AddSession from './AddSession';
import SessionModal from './SessionModal';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Session() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false); // New state for start modal
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [sessionToStart, setSessionToStart] = useState(null); // Store the session ID to start
  const [sessions, setSessions] = useState([]);
  const [statusCheck,setStatusCheck]=useState('')
  const [statusCheck2,setStatusCheck2]=useState('')

  const navigate = useNavigate();

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

  const openStartModal = (sessionId) => {
    setSessionToStart(sessionId);  // Set session ID to start
    setIsStartModalOpen(true);     // Open the start session modal
  };

  const closeStartModal = () => {
    setIsStartModalOpen(false);
    setSessionToStart(null); // Reset the session to start
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/section/deletesection/${sessionToDelete}`);
      setSessions(sessions.filter(session => session._id !== sessionToDelete));
      closeDeleteModal();
    } catch (error) {
      console.log('Error deleting session:', error);
    }
  };

  const handleStartSession = async () => {
    try {
      const sessionIndex = sessions.findIndex(item => item._id === sessionToStart);
      const session = sessions[sessionIndex];
  
      //  Update on the server with `startquiz`
      await axios.patch("http://localhost:8000/api/v1/section/startquiz", {
        sectionId: sessionToStart,
        questionType: session?.questionType,
      });
  
      //  Update on the server with `togglestatus`
      await axios.patch("http://localhost:8000/api/v1/section/togglestatus", {
        sectionId: sessionToStart,
      });
  
      //  Call `checkactivebadge` and log the response
      const { data } = await axios.get("http://localhost:8000/api/v1/section/checkactivebadge", {
        params: { sectionId: sessionToStart },
      });
  
      console.log('Check Active Badge Response:', data.isActiveBadge);
      setStatusCheck(data.isActiveBadge)

  
      //  Update state: Set only the current session to active
      const updatedSessions = sessions.map(item => ({
        ...item,
        isActive: item._id === sessionToStart,
        isActiveBadge: item._id === sessionToStart ? !item.isActiveBadge : item.isActiveBadge,
      }));
      setSessions(updatedSessions);
  
      console.log('Session started, status toggled, and badge status checked successfully');
      closeStartModal();
    } catch (error) {
      console.error('Error starting session, toggling status, or checking badge:', error);
    }
  };
  
  
  const handleEndSession = async (sessionId) => {
    try {
      // Step 1: Call the `togglereverse` API
      const { data } = await axios.patch("http://localhost:8000/api/v1/section/togglereverse", {
        sectionId: sessionId,
      });
  
      console.log('Toggle Reverse Response:', data.data.isActiveBadge);
  setStatusCheck2(data.data.isActiveBadge)
      // Step 2: Update the session state locally
      const updatedSessions = sessions.map(item => 
        item._id === sessionId ? { ...item, isActive: false, isActiveBadge: false } : item
      );
      setSessions(updatedSessions);
  
      console.log('Session ended successfully and state updated');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };
  
  
  const getSessions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/section/getsections");
     
      setSessions(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.log("Error fetching sessions:", error);
    }
  };
  
  useEffect(() => {
    getSessions();
  }, []);

  const addQuestions = (id, questionType) => {
    if (questionType === "MCQ") {
      navigate(`/mcquestions/${id}`);
    } else if (questionType === "Descriptive") {
      navigate(`/shortanswerquestions/${id}`);
    }
  };

  const viewQuestions = (id, questionType) => {
    if (questionType === "MCQ") {
      navigate(`/questions/${id}`);
    } else if (questionType === "Descriptive") {
      navigate(`/descriptivequestions/${id}`);
    }
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
          {sessions.map((item) => (
            <div className={styles.sessionsListCard} key={item._id}>
              <div className={styles.fontHead}>
                <h5>{item.sectionName}</h5>
                <p>{item.date}</p>
                <h6>{`${item.questionType} Question`}</h6>
                {/* Updated Badge Logic */}
               {/* Updated Badge Logic */}
<span
  className={
    item.isActiveBadge === undefined
      ? ''
      : item.isActiveBadge
      ? `${styles.activeBadge}`
      : ``
  }
>
  {item.isActiveBadge === undefined
    ? ''
    : item.isActiveBadge
    ? 'Active'
    : ''}
</span>

              </div>
              <div className={styles.icons}>
                <FontAwesomeIcon
                  className={styles.editIcon}
                  icon={faPen}
                  onClick={() => addQuestions(item._id, item.questionType)}
                />
                <FontAwesomeIcon
                  className={styles.viewIcon}
                  icon={faEye}
                  onClick={() => viewQuestions(item._id, item.questionType)}
                />
                <FontAwesomeIcon
                  className={styles.trashIcon}
                  icon={faTrash}
                  onClick={() => openDeleteModal(item._id)}
                />
              </div>
              <div className={styles.buttonDisplay}>
                <button
                  className={styles.actionButtonStart}
                  onClick={() => openStartModal(item._id)}
                >
                  Start
                </button>
                <button
                  className={styles.actionButtonEnd}
                  onClick={() => handleEndSession(item._id)}
                >
                  End
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
  
      {/* Add Session Modal */}
      {isAddModalOpen && <AddSession onClose={closeAddModal} refreshSessions={getSessions} />}
  
      {/* Delete Confirmation Modal */}
      <SessionModal
        isOpen={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={closeDeleteModal}
        title="Delete Session"
        message="Are you sure you want to delete this session?"
        confirmButtonText="Delete"
      />
  
      {/* Start Session Modal */}
      <SessionModal
        isOpen={isStartModalOpen}
        onOk={handleStartSession}
        onCancel={closeStartModal}
        title="Start Session"
        message="Are you sure you want to start this session?"
        confirmButtonText="Start"
      />
  
      <Footer />
    </div>
  );
}

export default Session;
