// models/Patient.js

const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: false 
  },
  lastName: { 
    type: String, 
    required: false 
  },
  dateOfBirth: { 
    type: Date, 
    required: false 
  },
  gender: { 
    type: String, 
    required: false,
    enum: ['male', 'female', 'other', null, ''] // Allow null and empty string
  },
  address: { 
    type: String, 
    required: false 
  },
  reports: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Report' 
  }]
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Pre-remove middleware to delete associated reports
patientSchema.pre('remove', async function(next) {
  try {
    await this.model('Report').deleteMany({ patientId: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Patient', patientSchema);