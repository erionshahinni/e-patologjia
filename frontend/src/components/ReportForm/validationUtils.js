// components/ReportForm/validationUtils.js

export const validateForm = (formData) => {
  const errors = {};
  
  // Basic validation for number fields
  if (formData.price && isNaN(parseFloat(formData.price))) {
    errors.price = 'Price must be a valid number';
  }
  
  // Check required fields for different report types
  if (formData.reportType === 'Biopsy') {
    // For Biopsy reports
    if (!formData.sample || formData.sample.trim() === '') {
      errors.sample = 'Sample is required for Biopsy reports';
    }
    
    if (!formData.histopathologicalDiagnosis || formData.histopathologicalDiagnosis.trim() === '') {
      errors.histopathologicalDiagnosis = 'Histopathological diagnosis is required for Biopsy reports';
    }
    
    if (!formData.microscopicExamination || formData.microscopicExamination.trim() === '') {
      errors.microscopicExamination = 'Microscopic examination is required for Biopsy reports';
    }
    
    if (!formData.macroscopicExamination || formData.macroscopicExamination.trim() === '') {
      errors.macroscopicExamination = 'Macroscopic examination is required for Biopsy reports';
    }
  } 
  else if (formData.reportType === 'PapTest' || formData.reportType === 'Cytology') {
    // For PapTest and Cytology reports
    if (!formData.sample || formData.sample.trim() === '') {
      errors.sample = `Sample is required for ${formData.reportType} reports`;
    }
    
    if (!formData.cytologicalExamination || formData.cytologicalExamination.trim() === '') {
      errors.cytologicalExamination = `Cytological examination is required for ${formData.reportType} reports`;
    }
  }
  else if (formData.reportType === 'PapTest2') {
    // For PapTest2 reports - sample is NOT required
    
    // Check if sampleType is specified
    if (!formData.paptest2Data?.sampleType?.selected) {
      errors.sampleType = 'Sample type is required for PapTest2 reports';
    }
    
    // If "other" is selected for sample type, other text must be provided
    if (formData.paptest2Data?.sampleType?.selected === 'other' && 
        (!formData.paptest2Data.sampleType.otherText || formData.paptest2Data.sampleType.otherText.trim() === '')) {
      errors.sampleTypeOther = 'Please specify other sample type';
    }
    
    // Check if sampleQuality is specified
    if (!formData.paptest2Data?.sampleQuality?.selected) {
      errors.sampleQuality = 'Sample quality is required for PapTest2 reports';
    }
    
    // Check if results option is selected
    if (!formData.paptest2Data?.results?.selected) {
      errors.results = 'Results selection is required for PapTest2 reports';
    }
    
    // Check if atypical cells are selected but no type is specified
    if (formData.paptest2Data?.results?.epithelialAbnormalities?.squamousCells?.atypicalCells?.selected &&
        !formData.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells.type) {
      errors.atypicalCellsType = 'Please select atypical cells type';
    }
  }
  
  // All report types require a diagnosis
  if (!formData.diagnosis || formData.diagnosis.trim() === '') {
    errors.diagnosis = 'Diagnosis is required for all report types';
  }
  
  return errors;
};

  
  // Optional: Add more specialized validation functions as needed
  export const validateEditReport = (reportData) => {
    const errors = validateForm(reportData);
    
    // Add additional validation logic specific to the editing context if needed
    
    return errors;
  };