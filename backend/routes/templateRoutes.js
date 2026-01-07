// routes/templateRoutes.js

const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { auth } = require('../middleware/auth');

// All template routes require authentication
// Get all templates
router.get('/', auth, templateController.getTemplates);

// Get template by ID
router.get('/:id', auth, templateController.getTemplateById);

// Create new template
router.post('/', auth, templateController.createTemplate);

// Update template
router.put('/:id', auth, templateController.updateTemplate);

// Delete template
router.delete('/:id', auth, templateController.deleteTemplate);

module.exports = router;