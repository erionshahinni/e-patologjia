// components/TemplateForm/validationUtils.js

export const validateTemplateForm = (formData) => {
    const errors = {};
    
    // Name validation
    if (!formData.name) {
      errors.name = 'Template name is required';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Template name cannot exceed 100 characters';
    }
    
    // Report Type validation
    if (!formData.reportType) {
      errors.reportType = 'Please select a report type';
    }
    
    // For Biopsy report type, ensure at least one of the examination fields is filled
    if (formData.reportType === 'Biopsy') {
      const hasBiopsyContent = formData.diagnosis || 
                              formData.histopathologicalDiagnosis || 
                              formData.microscopicExamination || 
                              formData.macroscopicExamination;
                              
      if (!hasBiopsyContent) {
        errors.diagnosis = 'At least one examination field must be filled';
      }
    }
    
    // For PapTest or Cytology, ensure cytologicalExamination is filled
    if ((formData.reportType === 'PapTest' || 
         formData.reportType === 'Cytology' || 
         formData.reportType === 'PapTest2') && 
         !formData.cytologicalExamination && 
         !formData.diagnosis) {
      errors.cytologicalExamination = 'Please provide examination details';
    }
    
    return errors;
  };
  
  export const validateEditTemplate = (templateData) => {
    // For edit mode, we can reuse the same validation logic
    return validateTemplateForm(templateData);
  };