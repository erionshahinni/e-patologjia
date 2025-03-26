// components/TemplateForm/index.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import BasicInfoForm from './BasicInfoForm';
import DetailsForm from './DetailsForm';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import { useTemplateHandlers } from './utils';

const TemplateForm = ({ onAddTemplate }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    reportType: '',
    diagnosis: '',
    microscopicExamination: '',
    macroscopicExamination: '',
    sample: '',
    cytologicalExamination: '',
    histopathologicalDiagnosis: '',
  });

  const { 
    handleChange, 
    handleReportTypeChange, 
    handleSubmit 
  } = useTemplateHandlers({
    formData,
    setFormData,
    setIsSubmitting,
    setModalMessage,
    setIsSuccessModalOpen,
    setIsErrorModalOpen,
    setErrors,
    isEditMode: false,
    onCompleted: onAddTemplate
  });

  // Handle modal close actions
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setActiveTab('basic'); // Reset to basic tab after successful submission
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  // Check if form is valid to enable submit
  const isFormValid = () => {
    return formData.name && formData.reportType;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Link to="/templates" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Template</h1>
            <p className="text-sm text-gray-500">Create a new medical report template</p>
          </div>
        </div>

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
                  disabled={!isFormValid()}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
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
          onClose={handleCloseErrorModal}
          message={modalMessage}
        />
      </div>
    </div>
  );
};

export default TemplateForm;