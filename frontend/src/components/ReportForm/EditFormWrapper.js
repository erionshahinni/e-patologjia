import React, { useState } from 'react';
import EditForm from './EditForm';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const EditFormWrapper = ({ patientId, selectedReport, templates = [], onSuccess, onError }) => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSuccess = (message) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
    if (onSuccess) onSuccess(message); // Pass success message to parent
  };

  const handleError = (message) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
    if (onError) onError(message); // Pass error message to parent
  };

  return (
    <>
      <EditForm
        patientId={patientId}
        selectedReport={selectedReport}
        templates={templates}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={modalMessage}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        message={modalMessage}
      />
    </>
  );
};

export default EditFormWrapper;