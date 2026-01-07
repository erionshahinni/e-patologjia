// components/TemplateForm/index.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import BasicInfoForm from './BasicInfoForm';
import DetailsForm from './DetailsForm';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import { useTemplateHandlers } from './utils';

const TemplateForm = ({ onAddTemplate }) => {
  const navigate = useNavigate();
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
    // Navigate to templates list page
    navigate('/templates');
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
        <Link to="/templates" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="font-medium">Back to Templates</span>
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Template</h1>
              <p className="text-gray-600 mt-1">Create a new medical report template</p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <TabsTrigger 
                value="basic"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-md transition-all"
              >
                Basic Information
              </TabsTrigger>
              <TabsTrigger 
                value="details"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-md transition-all"
              >
                Template Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicInfoForm 
                formData={formData} 
                handleChange={handleChange} 
                handleReportTypeChange={handleReportTypeChange}
                errors={errors}
              />
              
              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  disabled={!isFormValid()}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
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