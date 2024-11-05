import React, { useState, useEffect } from 'react';
import styles from './../assets/css/session.module.css';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faPen, faEye } from '@fortawesome/free-solid-svg-icons';
import AddSession from './AddSession';
import SessionModal from './SessionModal';
import axios from 'axios';
import {useNavigate} from "react-router-dom";


function Session() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [sessions, setSessions] = useState([]);
  const navigate=useNavigate();
  

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openDeleteModal = (sessionId) => {
    console.log(sessionId)
    setSessionToDelete(sessionId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/section/deletesection/${sessionToDelete}`);
      console.log(`Deleted session with ID: ${sessionToDelete}`);
      closeDeleteModal();
      setSessions(sessions.filter(session => session._id !== sessionToDelete)); // Update the session list locally
    } catch (error) {
      console.log('Error deleting session:', error);
    }
  };
  

  const getSessions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/section/getsections");

      setSessions(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSessions();
  }, []);
  // To add questions into the section;
  const addQuestions=async(id,questionType)=>{
    
    
    if(questionType==="MCQ"){
      navigate(`/mcquestions/${id}`)
    }else if(questionType==="Descriptive"){
      navigate(`/shortanswerquestions/${id}`)
    }

  }
  const viewQuestions=async(id,questionType)=>{
    console.log(id)
    if(questionType==="MCQ"){
      navigate(`/questions/${id}`)
    }else if(questionType==="Descriptive"){
      navigate(`/descriptivequestions/${id}`)
    }
    
  }
  const sectionStart = async (sectionId) => {
    try {
      const response = await axios.patch("http://localhost:8000/api/v1/section/startquiz", {
        sectionId,
        questionType: sessions.find(session => session._id === sectionId)?.questionType,
      });
      console.log( response);
      // Optionally, update UI or show a success message here
    } catch (error) {
      console.error('Error starting quiz:', error);
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
            <div className={styles.sessionsListCard} key={item.id}>
              <div className={styles.fontHead}>
                <h5>{item.sectionName}</h5>
                <p>{item.date}</p>
                <h6>{`${item.questionType} Question`}</h6>
              </div>
              <div className={styles.icons}>
                <FontAwesomeIcon className={styles.editIcon} icon={faPen} onClick={()=>addQuestions(item._id,item.questionType)} />
                <FontAwesomeIcon className={styles.viewIcon} icon={faEye} onClick={()=>viewQuestions(item._id,item.questionType)} />
                <FontAwesomeIcon
                  className={styles.trashIcon}
                  icon={faTrash}
                  onClick={() => openDeleteModal(item._id)}
                />
              </div>
              <div className={styles.buttonDisplay}>
                <button className={styles.actionButtonStart} onClick={()=>sectionStart(item._id)}>Start</button>
                <button className={styles.actionButtonEnd}>End</button>

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
  onOk={handleDelete} // Directly call handleDelete here
  onCancel={closeDeleteModal}
/>


      <Footer />
    </div>
  );
}

export default Session;
