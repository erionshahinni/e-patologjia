// components/TemplateForm/utils.js
import { createTemplate, updateTemplate } from '../../services/api';
import { validateTemplateForm, validateEditTemplate } from './validationUtils';

export const useTemplateHandlers = ({
  formData,
  setFormData,
  setIsSubmitting,
  setModalMessage,
  setIsSuccessModalOpen,
  setIsErrorModalOpen,
  setErrors,
  isEditMode = false,
  onCompleted = null,
  templateId = null
}) => {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (setErrors) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };
  
  const handleReportTypeChange = (e) => {
    const { name, value } = e.target;
    
    // When report type changes, reset all the content fields
    setFormData(prev => ({
      ...prev,
      [name]: value,
      diagnosis: '',
      microscopicExamination: '',
      macroscopicExamination: '',
      sample: '',
      cytologicalExamination: '',
      histopathologicalDiagnosis: '',
    }));
    
    // Clear error when user changes type
    if (setErrors) {
      setErrors({});
    }
  };
  
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    // Validate form based on mode
    const validationFunction = isEditMode ? validateEditTemplate : validateTemplateForm;
    const validationErrors = validationFunction(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      if (setErrors) {
        setErrors(validationErrors);
      }
      
      setModalMessage('Please fix the highlighted errors');
      setIsErrorModalOpen(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let response;
      
      if (isEditMode && templateId) {
        // Update existing template
        response = await updateTemplate(templateId, formData);
        setModalMessage('Template updated successfully');
      } else {
        // Create new template
        response = await createTemplate(formData);
        setModalMessage('Template created successfully');
        
        // Reset form on successful creation
        if (!isEditMode) {
          setFormData({
            name: '',
            reportType: '',
            diagnosis: '',
            microscopicExamination: '',
            macroscopicExamination: '',
            sample: '',
            cytologicalExamination: '',
            histopathologicalDiagnosis: ''
          });
        }
      }
      
      setIsSuccessModalOpen(true);
      
      // Call the completion callback if provided
      if (onCompleted && typeof onCompleted === 'function') {
        onCompleted(response);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} template:`, error);
      setModalMessage(`Failed to ${isEditMode ? 'update' : 'create'} template: ${error.message || 'Unknown error'}`);
      setIsErrorModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    handleChange,
    handleReportTypeChange,
    handleSubmit
  };
};