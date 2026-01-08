import React, { useState, useEffect } from 'react';
import { createReport, getTemplates } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const CreateReport = ({ onAddReport }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientId: id,
    reportType: 'Biopsy',
    diagnosis: '',
    microscopicExamination: '',
    macroscopicExamination: '',
    sample: '',
    cytologicalExamination: '',
    templateId: '',
    status: 'Not Created', // Default status
  });
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getTemplates();
        setTemplates(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTemplates();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    const selectedTemplate = templates.find((template) => template._id === templateId);
    if (selectedTemplate) {
      setFormData({
        ...formData,
        diagnosis: selectedTemplate.diagnosis,
        microscopicExamination: selectedTemplate.microscopicExamination,
        macroscopicExamination: selectedTemplate.macroscopicExamination,
        sample: selectedTemplate.sample,
        cytologicalExamination: selectedTemplate.cytologicalExamination,
        templateId: selectedTemplate._id,
      });
    }
  };

  const handleSubmit = async (status) => {
    try {
      const response = await createReport({ ...formData, status });
      onAddReport(response.data);
      setFormData({
        patientId: id,
        reportType: 'Biopsy',
        diagnosis: '',
        microscopicExamination: '',
        macroscopicExamination: '',
        sample: '',
        cytologicalExamination: '',
        templateId: '',
        status: 'Not Created',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Create Report</h1>
      <form>
        <select name="reportType" value={formData.reportType} onChange={handleChange}>
          <option value="Biopsy">Biopsy</option>
          <option value="PapTest">Pap Test</option>
          <option value="Cytology">Cytology</option>
        </select>
        <select name="templateId" value={formData.templateId} onChange={handleTemplateChange}>
          <option value="">Select Template</option>
          {templates.map((template) => (
            <option key={template._id} value={template._id}>
              {template.name}
            </option>
          ))}
        </select>
        <input type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} placeholder="Diagnosis" required />
        <input type="text" name="microscopicExamination" value={formData.microscopicExamination} onChange={handleChange} placeholder="Microscopic Examination" required />
        <input type="text" name="macroscopicExamination" value={formData.macroscopicExamination} onChange={handleChange} placeholder="Macroscopic Examination" required />
        <input type="text" name="sample" value={formData.sample} onChange={handleChange} placeholder="Sample" required />
        <input type="text" name="cytologicalExamination" value={formData.cytologicalExamination} onChange={handleChange} placeholder="Cytological Examination" required />
        <button type="button" onClick={() => handleSubmit('Controlled')}>Create Controlled Report</button>
        <button type="button" onClick={() => handleSubmit('Completed')}>Create Completed Report</button>
      </form>
    </div>
  );
};

export default CreateReport;