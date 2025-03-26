// components/ReportForm/utils.js
import { createReport, createTemplate } from '../../services/api';
import { validateForm } from './validationUtils';

export const useReportHandlers = ({
  templateName,
  setTemplateName,
  formData,
  setModalMessage,
  setIsErrorModalOpen,
  setIsTemplateSuccessModalOpen,
  setIsSuccessModalOpen,
  allTemplates,
  setAllTemplates,
  filteredTemplates,
  setFilteredTemplates,
  setActiveTab
}) => {
  // Handle saving the current form data as a template
  const handleSaveTemplate = async () => {
    if (!templateName) {
      setModalMessage('Please enter a template name');
      setIsErrorModalOpen(true);
      return;
    }

    try {
      // Prepare template data based on the current form state
      const templateData = {
        name: templateName,
        reportType: formData.reportType,
        diagnosis: formData.diagnosis,
        histopathologicalDiagnosis: formData.histopathologicalDiagnosis,
        microscopicExamination: formData.microscopicExamination,
        macroscopicExamination: formData.macroscopicExamination,
        sample: formData.sample,
        cytologicalExamination: formData.cytologicalExamination,
      };

      // Call the API to create a new template
      const response = await createTemplate(templateData);

      // Update the templates lists
      if (response && response.data) {
        setAllTemplates(prevTemplates => [...prevTemplates, response.data]);
        setFilteredTemplates(prevFiltered => [...prevFiltered, response.data]);
      }

      // Show success message modal
      setModalMessage('Template saved successfully');
      setIsTemplateSuccessModalOpen(true);

      // Clear the template name input
      setTemplateName('');
    } catch (error) {
      console.error('Error saving template:', error);
      setModalMessage(`Failed to save template: ${error.message || 'Unknown error'}`);
      setIsErrorModalOpen(true);
    }
  };

  // Handle form submission for reports
 // Update for utils.js file
// Look for the handleSubmit function in utils.js and update it to ensure the new fields are processed correctly

const handleSubmit = async (status) => {
  try {
    console.log('Report submission started with report type:', formData.reportType);
    
    // Only check validation for completed reports, not controlled ones
    if (status === 'Completed') {
      const validationErrors = validateForm(formData);
      
      console.log('Validation errors:', validationErrors);
      
      if (Object.keys(validationErrors).length > 0) {
        const errorMessages = Object.values(validationErrors).join(', ');
        setModalMessage(`Please fill in all required fields: ${errorMessages}`);
        setIsErrorModalOpen(true);
        
        // Determine which tab has errors
        const examinationErrors = [
          'sample', 'histopathologicalDiagnosis', 'microscopicExamination', 
          'macroscopicExamination', 'cytologicalExamination', 'sampleType', 
          'sampleQuality', 'results', 'sampleTypeOther', 'diagnosis'
        ];
        
        const hasExaminationErrors = Object.keys(validationErrors).some(
          err => examinationErrors.includes(err)
        );
        
        setActiveTab(hasExaminationErrors ? 'examination' : 'basic');
        return;
      }
    }

    // Create a clean copy of the form data to avoid mutating the state directly
    let reportPayload = { ...formData };
    
    // Make sure sample field is always provided with appropriate defaults for applicable report types
    if (reportPayload.reportType !== 'PapTest2') {
      if (!reportPayload.sample || reportPayload.sample.trim() === '') {
        if (reportPayload.reportType === 'Biopsy') {
          reportPayload.sample = reportPayload.macroscopicExamination?.substr(0, 50) || 'Tissue sample';
        } else if (reportPayload.reportType === 'PapTest' || reportPayload.reportType === 'Cytology') {
          reportPayload.sample = 'Cervical sample';
        }
      }
    } else {
      // For PapTest2, remove sample field completely
      delete reportPayload.sample;
    }
    
    // Format date properly or remove it if not set
    if (reportPayload.finishedAt) {
      reportPayload.finishedAt = new Date(reportPayload.finishedAt).toISOString();
    } else {
      delete reportPayload.finishedAt;
    }
    
    // Ensure institutionAddress is included in the payload
    if (!reportPayload.institutionAddress) {
      reportPayload.institutionAddress = '';
    }
    
    // Ensure referringDoctors is included and properly formatted
    if (!reportPayload.referringDoctors) {
      reportPayload.referringDoctors = '[]';
    } else {
      // Make sure it's a valid JSON string
      try {
        JSON.parse(reportPayload.referringDoctors);
      } catch (e) {
        reportPayload.referringDoctors = '[]';
      }
    }
    
    // Update final payload properties
    reportPayload = {
      ...reportPayload,
      status,
      price: parseFloat(reportPayload.price) || 0
    };

    // Handle PapTest2 data correctly
    if (reportPayload.reportType === 'PapTest2') {
      // Check if any enum fields are empty strings and set them to defaults
      if (reportPayload.paptest2Data.sampleType.selected === '') {
        reportPayload.paptest2Data.sampleType.selected = 'conventional'; // Default value
      }
      
      if (reportPayload.paptest2Data.sampleQuality.selected === '') {
        reportPayload.paptest2Data.sampleQuality.selected = 'satisfactory'; // Default value 
      }
      
      if (reportPayload.paptest2Data.results.selected === '') {
        reportPayload.paptest2Data.results.selected = 'nilm'; // Default value
      }
      
      // Check atypicalCells.type if it's selected but type is empty
      if (reportPayload.paptest2Data.results.epithelialAbnormalities?.squamousCells?.atypicalCells?.selected &&
          reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells.type === '') {
        // Set a default
        reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells.type = 'asc-us';
      }
      
      // Transform the form data to match the model schema structure
      const pt2Data = {
        sampleType: {
          conventional: reportPayload.paptest2Data.sampleType.selected === 'conventional',
          other: reportPayload.paptest2Data.sampleType.selected === 'other' ? 
                 reportPayload.paptest2Data.sampleType.otherText : ''
        },
        sampleQuality: {
          satisfactory: reportPayload.paptest2Data.sampleQuality.selected === 'satisfactory',
          unsatisfactory: reportPayload.paptest2Data.sampleQuality.selected === 'unsatisfactory',
          otherText: reportPayload.paptest2Data.sampleQuality.selected === 'unsatisfactory' ? 
                     reportPayload.paptest2Data.sampleQuality.otherText : ''
        },
        results: {
          negativeForLesion: reportPayload.paptest2Data.results.selected === 'nilm',
          reactiveChanges: reportPayload.paptest2Data.results.reactiveChanges.selected ? {
            inflammation: reportPayload.paptest2Data.results.reactiveChanges.inflammation.selected || false,
            inflammationDetails: reportPayload.paptest2Data.results.reactiveChanges.inflammation.selected ? {
              uid: reportPayload.paptest2Data.results.reactiveChanges.inflammation.uid || false,
              repair: reportPayload.paptest2Data.results.reactiveChanges.inflammation.repair || false,
              radiation: reportPayload.paptest2Data.results.reactiveChanges.inflammation.radiation || false,
              cylindricalCells: reportPayload.paptest2Data.results.reactiveChanges.inflammation.cylindricalCells || false
            } : null,
            squamousMetaplasia: reportPayload.paptest2Data.results.reactiveChanges.squamousMetaplasia || false,
            atrophy: reportPayload.paptest2Data.results.reactiveChanges.atrophy || false,
            pregnancyRelated: reportPayload.paptest2Data.results.reactiveChanges.pregnancyRelated || false,
            hormonal: reportPayload.paptest2Data.results.reactiveChanges.hormonalStatus || false,
            endometrialCells: reportPayload.paptest2Data.results.reactiveChanges.endometrialCells || false
          } : null,
          epithelialAbnormalities: reportPayload.paptest2Data.results.selected === 'abnormalities' ? {
            squamousCell: reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.selected ? {
              atypical: reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells.selected || false,
              ascUs: reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells.selected && 
                     reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells.type === 'asc-us',
              ascH: reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells.selected && 
                    reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells.type === 'asc-h',
              lsil: reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.lsil || false,
              hsil: reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.hsil || false,
              hsilExtensive: false, // Default value
              invasionSuspected: reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.invasionSuspected || false,
              squamousCellCarcinoma: reportPayload.paptest2Data.results.epithelialAbnormalities.squamousCells.carcinoma || false
            } : null,
            glandular: reportPayload.paptest2Data.results.epithelialAbnormalities.glandularCells.selected ? {
              atypical: {
                endocervical: reportPayload.paptest2Data.results.epithelialAbnormalities.glandularCells.atypical.endocervical || false,
                endometrial: reportPayload.paptest2Data.results.epithelialAbnormalities.glandularCells.atypical.endometrial || false,
                glandular: reportPayload.paptest2Data.results.epithelialAbnormalities.glandularCells.atypical.glandular || false,
                neoplastic: reportPayload.paptest2Data.results.epithelialAbnormalities.glandularCells.atypical.neoplastic || false
              },
              endocervicalAdenocarcinomaInSitu: reportPayload.paptest2Data.results.epithelialAbnormalities.glandularCells.adenocarcinomaInSitu || false,
              adenocarcinoma: {
                endocervical: reportPayload.paptest2Data.results.epithelialAbnormalities.glandularCells.adenocarcinoma.endocervical || false,
                endometrial: reportPayload.paptest2Data.results.epithelialAbnormalities.glandularCells.adenocarcinoma.endometrial || false
              },
              otherMalignancy: reportPayload.paptest2Data.results.epithelialAbnormalities.glandularCells.otherMalignancy || ''
            } : null
          } : null
        },
        recommendations: {
          repeatAfterTreatment: reportPayload.paptest2Data.recommendations.repeatAfterTreatment || false,
          repeatAfter: {
            months: reportPayload.paptest2Data.recommendations.repeatAfterPeriod.months ? 
                    parseInt(reportPayload.paptest2Data.recommendations.repeatAfterPeriod.months) : null,
            years: reportPayload.paptest2Data.recommendations.repeatAfterPeriod.years ? 
                    parseInt(reportPayload.paptest2Data.recommendations.repeatAfterPeriod.years) : null
          },
          hpvTyping: reportPayload.paptest2Data.recommendations.hpvTyping || false,
          colposcopy: reportPayload.paptest2Data.recommendations.colposcopy || false,
          biopsy: reportPayload.paptest2Data.recommendations.biopsy || false
        },
        comments: reportPayload.paptest2Data.comments || ''
      };
      reportPayload.paptest2Data = pt2Data;
    }

    // Remove templateId if empty
    if (!reportPayload.templateId) {
      delete reportPayload.templateId;
    }

    // Log the payload for debugging
    console.log('Sending report payload:', JSON.stringify(reportPayload, null, 2));

    const response = await createReport(reportPayload);
    
    if (response) {
      setModalMessage(`Report ${status === 'Completed' ? 'completed' : 'saved'} successfully`);
      setIsSuccessModalOpen(true);
    } else {
      setModalMessage('Failed to create report: No response from server');
      setIsErrorModalOpen(true);
    }
  } catch (error) {
    console.error('Error creating report:', error);
    setModalMessage(`Failed to create report: ${error.message || 'Unknown error'}`);
    setIsErrorModalOpen(true);
  }
};


  return { handleSaveTemplate, handleSubmit };
};