// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true,
    index: true
  },
  reportType: { 
    type: String, 
    required: false,
    default: 'Biopsy',
    enum: ['Biopsy', 'PapTest', 'PapTest2', 'Cytology']
  },
  // Common fields for all report types
  referenceNumber: { 
    type: String, 
    required: false,
    unique: true
  },
  healthcareInstitution: { 
    type: String, 
    required: false 
  },
  // Institution address field
  institutionAddress: {
    type: String,
    required: false
  },
  // Keep original field for backward compatibility
  referringDoctor: { 
    type: String, 
    required: false 
  },
  // Field for multiple doctors (stored as JSON string)
  referringDoctors: {
    type: String,
    required: false
  },
  paymentStatus: { 
    type: String, 
    required: false 
  },
  // Payment status tracking fields
  previousPaymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'unpaid', ''],
    default: ''
  },
  statusChangedAt: {
    type: Date
  },
  paymentHistory: [{
    status: {
      type: String,
      enum: ['paid', 'pending', 'unpaid', ''],
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  price: { 
    type: Number, 
    required: false,
    min: 0,
    default: 0
  },
  status: { 
    type: String, 
    enum: ['Not Created', 'Controlled', 'Completed'], 
    default: 'Not Created' 
  },
  finishedAt: {
    type: Date,
    required: false
  },
  // Common field for all report types
  diagnosis: { 
    type: String,
    required: false,
    default: ''
  },
  
  // Biopsy-specific fields
  histopathologicalDiagnosis: {
    type: String,
    required: false
  },
  microscopicExamination: { 
    type: String,
    required: false
  },
  macroscopicExamination: { 
    type: String,
    required: false
  },

  // PapTest and Cytology fields
  cytologicalExamination: { 
    type: String,
    required: false
  },

  // PapTest2-specific fields
  paptest2Data: {
    sampleType: {
      conventional: { type: Boolean, default: true },
      other: { type: String, default: '' }
    },
    sampleQuality: {
      satisfactory: { type: Boolean, default: true },
      unsatisfactory: { type: Boolean, default: false },
      otherText: { type: String, default: '' }
    },
    results: {
      negativeForLesion: { type: Boolean, default: true },
      reactiveChanges: {
        inflammation: { type: Boolean, default: false },
        inflammationDetails: {
          uid: { type: Boolean, default: false },
          repair: { type: Boolean, default: false },
          radiation: { type: Boolean, default: false },
          cylindricalCells: { type: Boolean, default: false }
        },
        squamousMetaplasia: { type: Boolean, default: false },
        atrophy: { type: Boolean, default: false },
        pregnancyRelated: { type: Boolean, default: false },
        hormonal: { type: Boolean, default: false },
        endometrialCells: { type: Boolean, default: false }
      },
      epithelialAbnormalities: {
        squamousCell: {
          atypical: { type: Boolean, default: false },
          ascUs: { type: Boolean, default: false },
          ascH: { type: Boolean, default: false },
          lsil: { type: Boolean, default: false },
          hsil: { type: Boolean, default: false },
          hsilExtensive: { type: Boolean, default: false },
          invasionSuspected: { type: Boolean, default: false },
          squamousCellCarcinoma: { type: Boolean, default: false }
        },
        glandular: {
          atypical: {
            endocervical: { type: Boolean, default: false },
            endometrial: { type: Boolean, default: false },
            glandular: { type: Boolean, default: false },
            neoplastic: { type: Boolean, default: false }
          },
          endocervicalAdenocarcinomaInSitu: { type: Boolean, default: false },
          adenocarcinoma: {
            endocervical: { type: Boolean, default: false },
            endometrial: { type: Boolean, default: false }
          },
          otherMalignancy: { type: String, default: '' }
        }
      }
    },
    recommendations: {
      repeatAfterTreatment: { type: Boolean, default: false },
      repeatAfter: {
        months: { type: Number, default: null },
        years: { type: Number, default: null }
      },
      hpvTyping: { type: Boolean, default: false },
      colposcopy: { type: Boolean, default: false },
      biopsy: { type: Boolean, default: false }
    },
    comments: { type: String, default: '' }
  },

  // Common field for all types
  sample: { 
    type: String,
    required: false,
    default: '' 
  },
  templateId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Template',
    required: false
  }
}, {
  timestamps: true
});

// Add compound index for patientId and createdAt
reportSchema.index({ patientId: 1, createdAt: -1 });

reportSchema.pre('save', function(next) {
  // Make sure we have a reasonable diagnosis for all report types
  if (!this.diagnosis || this.diagnosis.trim() === '') {
    if (this.reportType === 'Biopsy' && this.histopathologicalDiagnosis) {
      this.diagnosis = this.histopathologicalDiagnosis;
    } else if (['PapTest', 'Cytology'].includes(this.reportType) && this.cytologicalExamination) {
      this.diagnosis = this.cytologicalExamination.substring(0, 100) + (this.cytologicalExamination.length > 100 ? '...' : '');
    } else if (this.reportType === 'PapTest2') {
      // Construct diagnosis from PapTest2 data
      if (this.paptest2Data?.results?.negativeForLesion) {
        this.diagnosis = 'NEGATIV PËR LESION INTRAEPITELIAL APO MALINJITET (NILM)';
      } else {
        this.diagnosis = 'ABNORMALITETET E QELIZAVE EPITELIALE';
        
        // Add details if available
        if (this.paptest2Data?.results?.epithelialAbnormalities?.squamousCell?.squamousCellCarcinoma) {
          this.diagnosis += ' - Carcinoma squamocelulare';
        } else if (this.paptest2Data?.results?.epithelialAbnormalities?.glandular?.otherMalignancy) {
          this.diagnosis += ' - ' + this.paptest2Data.results.epithelialAbnormalities.glandular.otherMalignancy;
        }
      }
    } else {
      this.diagnosis = `${this.reportType || 'Medical'} report`;
    }
  }
  
  // Set sample if not already set (only for non-PapTest2 reports)
  if (this.reportType !== 'PapTest2' && (!this.sample || this.sample.trim() === '')) {
    this.sample = `${this.reportType || 'Medical'} sample`;
  }
  
  // Track payment status changes
  if (!this.isNew && this.isModified('paymentStatus')) {
    const previousStatus = this._previousPaymentStatus || '';
    
    // Store previous status if it's being tracked for the first time
    if (!this.previousPaymentStatus) {
      this.previousPaymentStatus = previousStatus;
    }
    
    // Set the change timestamp
    this.statusChangedAt = new Date();
    
    // Add to payment history
    this.paymentHistory = this.paymentHistory || [];
    this.paymentHistory.push({
      status: this.paymentStatus,
      changedAt: new Date()
      // changedBy can be set if you have the user ID available
    });
  }
  
  next();
});

// Capture the original payment status before changes
reportSchema.post('init', function() {
  this._previousPaymentStatus = this.paymentStatus;
});

module.exports = mongoose.model('Report', reportSchema);