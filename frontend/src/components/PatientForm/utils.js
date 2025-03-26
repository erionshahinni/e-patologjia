// components/PatientForm/utils.js

// Updated to make all fields optional
export const validatePatientForm = (formData) => {
  const errors = {};
  
  // All fields are optional now - validation only if a value is provided
  if (formData.firstName && formData.firstName.trim().length > 100) 
    errors.firstName = 'First Name cannot exceed 100 characters';
  
  if (formData.lastName && formData.lastName.trim().length > 100) 
    errors.lastName = 'Last Name cannot exceed 100 characters';
  
  // Optional date validation
  if (formData.dateOfBirth) {
    const date = new Date(formData.dateOfBirth);
    const today = new Date();
    if (isNaN(date.getTime()) || date > today) 
      errors.dateOfBirth = 'Please enter a valid date of birth';
  }
  
  // Gender value validation (only if provided)
  if (formData.gender && !['male', 'female', 'other'].includes(formData.gender)) 
    errors.gender = 'Please select a valid gender';
  
  if (formData.address && formData.address.trim().length > 500) 
    errors.address = 'Address cannot exceed 500 characters';
  
  return errors;
};