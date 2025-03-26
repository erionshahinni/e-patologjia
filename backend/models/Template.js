// models/Template.js

const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: false },
  reportType: { type: String, required: false }, // 'Biopsy', 'PapTest', 'Cytology'
  diagnosis: { type: String },
  histopathologicalDiagnosis: { type: String },
  microscopicExamination: { type: String },
  macroscopicExamination: { type: String },
  sample: { type: String },
  cytologicalExamination: { type: String },
});

module.exports = mongoose.model('Template', templateSchema);