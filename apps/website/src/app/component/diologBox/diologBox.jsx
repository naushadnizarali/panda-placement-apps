import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import CustomButton from '../Button/CustomButton';

const CustomDialog = ({ show, handleConfirm, handleCancel, message }) => {
  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        {message}
        <CustomButton width={100} label={'Cancel'} onClick={handleCancel} />
        <CustomButton width={100} label={'Confrim'} onClick={handleConfirm} />
      </Modal.Body>
    </Modal>
  );
};

export default CustomDialog;
