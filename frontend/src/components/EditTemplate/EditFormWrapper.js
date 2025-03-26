// components/EditTemplate/EditFormWrapper.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicInfoForm from '../TemplateForm/BasicInfoForm';
import DetailsForm from '../TemplateForm/DetailsForm';
import SuccessModal from '../TemplateForm/SuccessModal';
import ErrorModal from '../TemplateForm/ErrorModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { useTemplateHandlers } from '../TemplateForm/utils';

const EditFormWrapper = ({ 
  templateId, 
  templateData = {}, 
  onSuccess, 
  onError 
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formData, setFormData] = useState(templateData);

  const handleSuccess = (message) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
    // Don't call onSuccess here, wait for the modal to close
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    // After modal is closed, navigate back to templates list
    if (onSuccess) onSuccess(modalMessage);
  };

  const handleError = (message) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
    if (onError) onError(message); // Pass error message to parent
  };

  const { 
    handleChange, 
    handleReportTypeChange, 
    handleSubmit 
  } = useTemplateHandlers({
    formData,
    setFormData,
    setIsSubmitting,
    setModalMessage,
    setIsSuccessModalOpen: () => handleSuccess("Template updated successfully"),
    setIsErrorModalOpen: () => handleError("Failed to update template"),
    setErrors,
    isEditMode: true,
    templateId,
    onCompleted: null // We handle completion via the modal
  });

  return (
    <>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="details">Template Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoForm 
              formData={formData} 
              handleChange={handleChange} 
              handleReportTypeChange={handleReportTypeChange}
              errors={errors}
            />
            
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Next: Template Details
              </button>
            </div>
          </TabsContent>

          <TabsContent value="details">
            <DetailsForm 
              formData={formData} 
              handleChange={handleChange} 
              handleSubmit={handleSubmit}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
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