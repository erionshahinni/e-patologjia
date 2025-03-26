// controllers/templateController.js
const Template = require('../models/Template');

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching templates',
      error: error.message 
    });
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching template',
      error: error.message 
    });
  }
};

// Create template
exports.createTemplate = async (req, res) => {
  try {
    const template = new Template(req.body);
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating template',
      error: error.message 
    });
  }
};

// Update template
exports.updateTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    Object.assign(template, req.body);
    const updatedTemplate = await template.save();
    res.json(updatedTemplate);
  } catch (error) {
    res.status(400).json({ 
      message: 'Error updating template',
      error: error.message 
    });
  }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting template',
      error: error.message 
    });
  }
};