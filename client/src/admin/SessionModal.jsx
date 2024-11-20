import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import styles from './../assets/css/sSessionModal.module.css';

const SessionModal = ({ isOpen, onOk, onCancel, title, message, confirmButtonText }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      onOk(); // Call the onOk function passed as prop
    }, 1000);
  };

  return (
    <Modal
      title={title} // Use dynamic title passed as prop
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button
          key="ok"
          className={styles.okButton}
          type="primary"
          loading={confirmLoading}
          onClick={handleOk}
        >
          {confirmButtonText || 'OK'} {/* Dynamic text for confirm button */}
        </Button>,
        <Button key="cancel" className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      <p>{message}</p> {/* Dynamic message based on the action */}
    </Modal>
  );
};

export default SessionModal;
