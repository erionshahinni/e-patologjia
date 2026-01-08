// components/PatientForm/utils.js

// Only firstName and lastName are required, all other fields are optional
export const validatePatientForm = (formData) => {
  const errors = {};
  
  // First name is required
  if (!formData.firstName || formData.firstName.trim() === '') {
    errors.firstName = 'Emri është i detyrueshëm';
  } else if (formData.firstName.trim().length > 100) {
    errors.firstName = 'Emri nuk mund të kalojë 100 karaktere';
  }
  
  // Last name is required
  if (!formData.lastName || formData.lastName.trim() === '') {
    errors.lastName = 'Mbiemri është i detyrueshëm';
  } else if (formData.lastName.trim().length > 100) {
    errors.lastName = 'Mbiemri nuk mund të kalojë 100 karaktere';
  }
  
  // Optional date validation (only if provided)
  if (formData.dateOfBirth) {
    const date = new Date(formData.dateOfBirth);
    const today = new Date();
    if (isNaN(date.getTime()) || date > today) 
      errors.dateOfBirth = 'Ju lutem shkruani një datëlindje të vlefshme';
  }
  
  // Gender value validation (only if provided)
  if (formData.gender && !['male', 'female', 'other'].includes(formData.gender)) 
    errors.gender = 'Ju lutem zgjidhni një gjini të vlefshme';
  
  // Address validation (only if provided)
  if (formData.address && formData.address.trim().length > 500) 
    errors.address = 'Adresa nuk mund të kalojë 500 karaktere';
  
  return errors;
};