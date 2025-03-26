// routes/templateRoutes.js

const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

// Get all templates
router.get('/', templateController.getTemplates);

// Get template by ID
router.get('/:id', templateController.getTemplateById);

// Create new template
router.post('/', templateController.createTemplate);

// Update template
router.put('/:id', templateController.updateTemplate);

// Delete template
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;