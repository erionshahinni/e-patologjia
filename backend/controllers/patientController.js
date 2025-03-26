const Patient = require('../models/Patient');
const Report = require('../models/Report');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createPatient = async (req, res) => {
  try {
    // Create new patient with available data
    const patient = new Patient(req.body);
    const savedPatient = await patient.save();
    res.status(201).json(savedPatient);
  } catch (error) {
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A patient with these details already exists',
        error: error.message 
      });
    }
    console.error('Patient creation error:', error);
    res.status(400).json({ 
      message: 'Error creating patient', 
      error: error.message 
    });
  }
};

// Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate({
        path: 'reports',
        options: { sort: { createdAt: -1 } }
      })
      .sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ 
      message: 'Error fetching patients', 
      error: error.message 
    });
  }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate({
        path: 'reports',
        options: { sort: { createdAt: -1 } }
      });
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.json(patient);
  } catch (error) {
    console.error('Error fetching patient by ID:', error);
    res.status(500).json({ 
      message: 'Error fetching patient', 
      error: error.message 
    });
  }
};

// Update patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update only the fields that are provided
    const updateFields = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (value !== undefined && value !== null) {
        updateFields[key] = value;
      }
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(400).json({ 
      message: 'Error updating patient', 
      error: error.message 
    });
  }
};

// controllers/patientController.js - ADDITIONAL FIXES

// Updated exports.deletePatient function in controllers/patientController.js
exports.deletePatient = async (req, res) => {
  try {
    // Check for PIN in request
    const { pin } = req.body;
    if (!pin) {
      return res.status(400).json({ message: 'PIN is required for deletion' });
    }

    console.log(`Delete patient request received for patient ID: ${req.params.id}`);

    // Verify that user info is available (debug)
    if (!req.user) {
      console.error('User information missing in request. Authentication middleware may not be working correctly.');
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the user's role and PIN
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`User role: ${user.role}, User has PIN: ${!!user.pin}`);

    // Only admin users can delete patients
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin users can delete patients' });
    }

    // Check if admin has a PIN set
    if (!user.pin) {
      console.log('No PIN set for this admin user');
      return res.status(400).json({ message: 'No PIN set for this admin user. Please set a PIN in Admin Panel → Security Settings.' });
    }

    // Validate the PIN against the current admin user's PIN
    const isPinValid = await bcrypt.compare(pin, user.pin);
    console.log(`PIN validation result: ${isPinValid}`);

    if (!isPinValid) {
      return res.status(401).json({ message: 'Invalid PIN' });
    }

    // Check if the patient exists
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      console.log('Patient not found');
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Proceed with deletion after successful PIN validation
    console.log('PIN validated successfully, proceeding with deletion');

    try {
      // First delete associated reports using Promise.all for better error handling
      const associatedReports = await Report.find({ patientId: req.params.id });
      console.log(`Found ${associatedReports.length} reports associated with patient`);
      
      if (associatedReports.length > 0) {
        await Promise.all(
          associatedReports.map(report => 
            Report.deleteOne({ _id: report._id })
              .then(() => console.log(`Deleted report ${report._id}`))
              .catch(err => console.error(`Error deleting report ${report._id}:`, err))
          )
        );
      }
      
      // Then delete the patient
      const result = await Patient.deleteOne({ _id: req.params.id });
      
      if (result.deletedCount === 0) {
        console.log('Patient not deleted, possibly already removed');
        return res.status(404).json({ message: 'Patient not found or already deleted' });
      }
      
      console.log(`Patient deleted successfully: ${result.deletedCount} document removed`);
      
      res.json({ 
        message: 'Patient and associated reports deleted successfully',
        reportsDeleted: associatedReports.length,
        patientDeleted: result.deletedCount
      });
    } catch (deleteError) {
      console.error('Database deletion error:', deleteError);
      return res.status(500).json({ 
        message: 'Database error during deletion operation', 
        error: deleteError.message 
      });
    }
  } catch (error) {
    console.error('Error in delete patient controller:', error);
    res.status(500).json({ 
      message: 'Error deleting patient', 
      error: error.message 
    });
  }
};