// components/PatientForm/index.js
import React, { useState } from 'react';
import { createPatient } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/card';
import  Button  from '../ui/button';
import PersonalInfoForm from './PersonalInfoForm';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';
import { validatePatientForm } from './utils';

const PatientForm = () => {
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePatientForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await createPatient(formData);
      if (response) {
        setModalMessage('Pacienti u krijua me sukses');
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error('Patient creation error:', error);
      setModalMessage(error.response?.data?.message || 'Failed to create patient');
      setIsErrorModalOpen(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/');
  };

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto p-6 space-y-6 flex-grow">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Krijo pacient te ri</h1>
            <p className="text-gray-500">Shkruaj detajet e pacientit</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalInfoForm formData={formData} handleChange={handleChange} errors={errors} />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <CheckCircle2 className="h-4 w-4" />
              Krijo Pacientin
            </Button>
          </div>
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

export default PatientForm;