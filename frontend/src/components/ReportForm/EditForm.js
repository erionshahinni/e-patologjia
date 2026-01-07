// components/ReportForm/EditForm.js
import React, { useState, useEffect, useCallback } from 'react';
import { createReport, updateReport, createTemplate } from '../../services/api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import BasicInfoForm from './BasicInfoForm';
import ExaminationDetails from './ExaminationDetails';
import TemplateSection from './TemplateSection';
import { validateEditReport } from './validationUtils';

// Update to the initialReportState in EditForm.js
const initialReportState = {
  reportType: '', // Changed from 'Biopsy' to empty string
  referenceNumber: '',
  healthcareInstitution: '',
  institutionAddress: '',
  referringDoctor: '',
  referringDoctors: '[]',
  paymentStatus: '',
  price: '',
  finishedAt: '',
  diagnosis: '',
  histopathologicalDiagnosis: '',
  microscopicExamination: '',
  macroscopicExamination: '',
  sample: '',
  cytologicalExamination: '',
  templateId: '',
  status: 'Not Created',
  paptest2Data: {
    sampleType: {
      selected: 'conventional',
      otherText: ''
    },
    sampleQuality: {
      selected: 'satisfactory',
      otherText: ''
    },
    results: {
      selected: 'nilm',
      epithelialAbnormalities: {
        squamousCells: {
          selected: false,
          atypicalCells: {
            selected: false,
            type: 'asc-us'
          },
          lsil: false,
          hsil: false,
          invasionSuspected: false,
          carcinoma: false
        },
        glandularCells: {
          selected: false,
          atypical: {
            endocervical: false,
            endometrial: false,
            glandular: false,
            neoplastic: false
          },
          adenocarcinomaInSitu: false,
          adenocarcinoma: {
            endocervical: false,
            endometrial: false
          },
          otherMalignancy: ''
        }
      },
      reactiveChanges: {
        selected: false,
        inflammation: {
          selected: false,
          uid: false,
          repair: false,
          radiation: false,
          cylindricalCells: false
        },
        squamousMetaplasia: false,
        atrophy: false,
        pregnancyRelated: false,
        hormonalStatus: false,
        endometrialCells: false
      }
    },
    recommendations: {
      repeatAfterTreatment: false,
      repeatAfterPeriod: {
        months: '',
        years: ''
      },
      hpvTyping: false,
      colposcopy: false,
      biopsy: false
    },
    comments: ''
  }
};


const EditForm = ({ 
  patientId, 
  selectedReport = null, 
  templates = [], 
  onSuccess, 
  onError 
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [templateName, setTemplateName] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [formData, setFormData] = useState({...initialReportState});

  // Initialize form with selected report data if editing
// This is the section in EditForm.js that needs to be updated
// Initialize form with selected report data if editing
useEffect(() => {
  if (selectedReport) {
    // Format paptest2Data correctly if it exists
    let paptest2Data = { ...initialReportState.paptest2Data };
    
    if (selectedReport.reportType === 'PapTest2' && selectedReport.paptest2Data) {
      const pt2 = selectedReport.paptest2Data;
      
      // Sample type
      paptest2Data.sampleType = {
        selected: pt2.sampleType?.conventional ? 'conventional' : 'other',
        otherText: pt2.sampleType?.other || ''
      };
      
      // Sample quality
      paptest2Data.sampleQuality = {
        selected: pt2.sampleQuality?.satisfactory ? 'satisfactory' : 'unsatisfactory',
        otherText: pt2.sampleQuality?.otherText || ''
      };
      
      // Check if any atypical or adenocarcinoma options are selected
      const hasAtypical = pt2.results?.epithelialAbnormalities?.glandular?.atypical?.endocervical || 
                         pt2.results?.epithelialAbnormalities?.glandular?.atypical?.endometrial || 
                         pt2.results?.epithelialAbnormalities?.glandular?.atypical?.glandular || 
                         pt2.results?.epithelialAbnormalities?.glandular?.atypical?.neoplastic;
                         
      const hasAdenocarcinoma = pt2.results?.epithelialAbnormalities?.glandular?.adenocarcinoma?.endocervical || 
                               pt2.results?.epithelialAbnormalities?.glandular?.adenocarcinoma?.endometrial;
      
      // Results
      paptest2Data.results = {
        selected: pt2.results?.negativeForLesion ? 'nilm' : 'abnormalities',
        epithelialAbnormalities: {
          squamousCells: {
            selected: pt2.results?.epithelialAbnormalities?.squamousCell ? true : false,
            atypicalCells: {
              selected: pt2.results?.epithelialAbnormalities?.squamousCell?.atypical || false,
              type: pt2.results?.epithelialAbnormalities?.squamousCell?.ascUs ? 'asc-us' : 
                    (pt2.results?.epithelialAbnormalities?.squamousCell?.ascH ? 'asc-h' : 'asc-us')
            },
            lsil: pt2.results?.epithelialAbnormalities?.squamousCell?.lsil || false,
            hsil: pt2.results?.epithelialAbnormalities?.squamousCell?.hsil || false,
            invasionSuspected: pt2.results?.epithelialAbnormalities?.squamousCell?.invasionSuspected || false,
            carcinoma: pt2.results?.epithelialAbnormalities?.squamousCell?.squamousCellCarcinoma || false
          },
          glandularCells: {
            selected: pt2.results?.epithelialAbnormalities?.glandular ? true : false,
            atypical: {
              selected: hasAtypical || false,
              endocervical: pt2.results?.epithelialAbnormalities?.glandular?.atypical?.endocervical || false,
              endometrial: pt2.results?.epithelialAbnormalities?.glandular?.atypical?.endometrial || false,
              glandular: pt2.results?.epithelialAbnormalities?.glandular?.atypical?.glandular || false,
              neoplastic: pt2.results?.epithelialAbnormalities?.glandular?.atypical?.neoplastic || false
            },
            adenocarcinomaInSitu: pt2.results?.epithelialAbnormalities?.glandular?.endocervicalAdenocarcinomaInSitu || false,
            adenocarcinoma: {
              selected: hasAdenocarcinoma || false,
              endocervical: pt2.results?.epithelialAbnormalities?.glandular?.adenocarcinoma?.endocervical || false,
              endometrial: pt2.results?.epithelialAbnormalities?.glandular?.adenocarcinoma?.endometrial || false
            },
            otherMalignancy: pt2.results?.epithelialAbnormalities?.glandular?.otherMalignancy || ''
          }
        },
        reactiveChanges: {
          selected: pt2.results?.reactiveChanges?.repair || 
                   pt2.results?.reactiveChanges?.inflammation || 
                   pt2.results?.reactiveChanges?.atrophy || 
                   pt2.results?.reactiveChanges?.pregnancyRelated || 
                   pt2.results?.reactiveChanges?.hormonal || 
                   pt2.results?.reactiveChanges?.endometrialCells || false,
          inflammation: {
            selected: pt2.results?.reactiveChanges?.inflammation || false,
            uid: pt2.results?.reactiveChanges?.inflammationDetails?.uid || false,
            repair: pt2.results?.reactiveChanges?.inflammationDetails?.repair || false,
            radiation: pt2.results?.reactiveChanges?.inflammationDetails?.radiation || false,
            cylindricalCells: pt2.results?.reactiveChanges?.inflammationDetails?.cylindricalCells || false
          },
          squamousMetaplasia: pt2.results?.reactiveChanges?.squamousMetaplasia || false,
          atrophy: pt2.results?.reactiveChanges?.atrophy || false,
          pregnancyRelated: pt2.results?.reactiveChanges?.pregnancyRelated || false,
          hormonalStatus: pt2.results?.reactiveChanges?.hormonal || false,
          endometrialCells: pt2.results?.reactiveChanges?.endometrialCells || false
        }
      };
      
      // Recommendations
      paptest2Data.recommendations = {
        repeatAfterTreatment: pt2.recommendations?.repeatAfterTreatment || false,
        repeatAfterPeriod: {
          months: pt2.recommendations?.repeatAfter?.months !== null && 
                  pt2.recommendations?.repeatAfter?.months !== undefined
            ? String(pt2.recommendations.repeatAfter.months)
            : '',
          years: pt2.recommendations?.repeatAfter?.years !== null && 
                 pt2.recommendations?.repeatAfter?.years !== undefined
            ? String(pt2.recommendations.repeatAfter.years)
            : ''
        },
        hpvTyping: pt2.recommendations?.hpvTyping || false,
        colposcopy: pt2.recommendations?.colposcopy || false,
        biopsy: pt2.recommendations?.biopsy || false
      };
      
      paptest2Data.comments = pt2.comments || '';
    }

    const reportData = {
      reportType: selectedReport.reportType || 'Biopsy',
      referenceNumber: selectedReport.referenceNumber || '',
      healthcareInstitution: selectedReport.healthcareInstitution || '',
      institutionAddress: selectedReport.institutionAddress || '',
      referringDoctor: selectedReport.referringDoctor || '',
      referringDoctors: selectedReport.referringDoctors || '[]',
      paymentStatus: selectedReport.paymentStatus || '',
      price: selectedReport.price !== undefined ? selectedReport.price : '',
      finishedAt: selectedReport.finishedAt?.split('T')[0] || '',
      diagnosis: selectedReport.diagnosis || '',
      histopathologicalDiagnosis: selectedReport.histopathologicalDiagnosis || '',
      microscopicExamination: selectedReport.microscopicExamination || '',
      macroscopicExamination: selectedReport.macroscopicExamination || '',
      sample: selectedReport.sample || '',
      cytologicalExamination: selectedReport.cytologicalExamination || '',
      templateId: selectedReport.templateId || '',
      status: selectedReport.status || 'Not Created',
      patientId: selectedReport.patientId || '',
      paptest2Data: paptest2Data
    };
    
    setFormData(reportData);
  } else {
    // Reset form when not editing
    setFormData({...initialReportState, patientId});
  }
}, [selectedReport, patientId]);

  // Filter templates based on report type
  useEffect(() => {
    if (templates && templates.length > 0) {
      setFilteredTemplates(
        templates.filter(template => template.reportType === formData.reportType)
      );
    } else {
      setFilteredTemplates([]);
    }
  }, [formData.reportType, templates]);

  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : '') : value
    }));
  }, []);

  const handlePapTest2Change = useCallback((section, value) => {
    console.log(`Updating paptest2Data.${section} with:`, value);
    
    setFormData(prev => {
      // Deep clone the current paptest2Data to avoid issues with references
      const updatedPaptest2Data = JSON.parse(JSON.stringify({
        ...prev.paptest2Data,
        [section]: value
      }));
      
      // Log the updated data for debugging
      console.log('Updated paptest2Data:', updatedPaptest2Data);
      
      return {
        ...prev,
        paptest2Data: updatedPaptest2Data
      };
    });
  }, []);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    if (!templateId) {
      setFormData(prev => ({
        ...prev,
        templateId: '',
        diagnosis: '',
        microscopicExamination: '',
        macroscopicExamination: '',
        sample: '',
        cytologicalExamination: '',
        histopathologicalDiagnosis: ''
      }));
      return;
    }

    const selectedTemplate = filteredTemplates.find(t => t._id === templateId);
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        diagnosis: selectedTemplate.diagnosis || selectedTemplate.histopathologicalDiagnosis || '',
        microscopicExamination: selectedTemplate.microscopicExamination || '',
        macroscopicExamination: selectedTemplate.macroscopicExamination || '',
        sample: selectedTemplate.sample || `${prev.reportType} sample from template`,
        cytologicalExamination: selectedTemplate.cytologicalExamination || '',
        histopathologicalDiagnosis: selectedTemplate.histopathologicalDiagnosis || '',
        templateId: selectedTemplate._id
      }));
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName) {
      onError('Please enter a template name');
      return;
    }

    try {
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

      await createTemplate(templateData);
      
      setTemplateName('');
      onSuccess('Template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
      onError(`Failed to save template: ${error.message || 'Unknown error'}`);
    }
  };

  // In EditForm.js
  const handleSubmit = async (status) => {
    try {
      console.log('Form submission started with status:', status);
      
      // Create a clean payload
      const cleanPayload = {
        patientId: formData.patientId,
        reportType: formData.reportType || 'Biopsy',
        status: status
      };
    
      // Only add fields with values to the payload
      if (formData.referenceNumber) cleanPayload.referenceNumber = formData.referenceNumber;
      if (formData.healthcareInstitution) cleanPayload.healthcareInstitution = formData.healthcareInstitution;
      if (formData.institutionAddress) cleanPayload.institutionAddress = formData.institutionAddress;
      if (formData.referringDoctor) cleanPayload.referringDoctor = formData.referringDoctor;
      
      // Always include referringDoctors, even if empty
      cleanPayload.referringDoctors = formData.referringDoctors || '[]';
      
      if (formData.paymentStatus) cleanPayload.paymentStatus = formData.paymentStatus;
      if (formData.price !== '') cleanPayload.price = parseFloat(formData.price) || 0;
      if (formData.diagnosis) cleanPayload.diagnosis = formData.diagnosis;
      if (formData.finishedAt) cleanPayload.finishedAt = new Date(formData.finishedAt).toISOString();
      if (formData.templateId) cleanPayload.templateId = formData.templateId;
      
      // Only include sample for non-PapTest2 reports
      if (formData.reportType !== 'PapTest2' && formData.sample) {
        cleanPayload.sample = formData.sample;
      }
    
      // Add report type specific fields
      if (formData.reportType === 'Biopsy') {
        if (formData.histopathologicalDiagnosis) cleanPayload.histopathologicalDiagnosis = formData.histopathologicalDiagnosis;
        if (formData.microscopicExamination) cleanPayload.microscopicExamination = formData.microscopicExamination;
        if (formData.macroscopicExamination) cleanPayload.macroscopicExamination = formData.macroscopicExamination;
      } 
      else if (formData.reportType === 'PapTest' || formData.reportType === 'Cytology') {
        if (formData.cytologicalExamination) cleanPayload.cytologicalExamination = formData.cytologicalExamination;
      }
      else if (formData.reportType === 'PapTest2') {
        console.log('PapTest2 data before transformation:', formData.paptest2Data);
        
        // Transform form data to match the database structure
        const transformedData = {
          sampleType: {
            conventional: formData.paptest2Data.sampleType.selected === 'conventional',
            other: formData.paptest2Data.sampleType.selected === 'other' ? 
                   formData.paptest2Data.sampleType.otherText : ''
          },
          sampleQuality: {
            satisfactory: formData.paptest2Data.sampleQuality.selected === 'satisfactory',
            unsatisfactory: formData.paptest2Data.sampleQuality.selected === 'unsatisfactory',
            otherText: formData.paptest2Data.sampleQuality.selected === 'unsatisfactory' ? 
                       formData.paptest2Data.sampleQuality.otherText : ''
          },
          results: {
            negativeForLesion: formData.paptest2Data.results.selected === 'nilm',
            reactiveChanges: formData.paptest2Data.results.reactiveChanges?.selected ? {
              inflammation: formData.paptest2Data.results.reactiveChanges.inflammation?.selected || false,
              inflammationDetails: formData.paptest2Data.results.reactiveChanges.inflammation?.selected ? {
                uid: formData.paptest2Data.results.reactiveChanges.inflammation.uid || false,
                repair: formData.paptest2Data.results.reactiveChanges.inflammation.repair || false,
                radiation: formData.paptest2Data.results.reactiveChanges.inflammation.radiation || false,
                cylindricalCells: formData.paptest2Data.results.reactiveChanges.inflammation.cylindricalCells || false
              } : null,
              squamousMetaplasia: formData.paptest2Data.results.reactiveChanges.squamousMetaplasia || false,
              atrophy: formData.paptest2Data.results.reactiveChanges.atrophy || false,
              pregnancyRelated: formData.paptest2Data.results.reactiveChanges.pregnancyRelated || false,
              hormonal: formData.paptest2Data.results.reactiveChanges.hormonalStatus || false,
              endometrialCells: formData.paptest2Data.results.reactiveChanges.endometrialCells || false
            } : null,
            epithelialAbnormalities: formData.paptest2Data.results.selected === 'abnormalities' ? {
              squamousCell: formData.paptest2Data.results.epithelialAbnormalities?.squamousCells?.selected ? {
                atypical: formData.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells?.selected || false,
                ascUs: formData.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells?.selected && 
                       formData.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells.type === 'asc-us',
                ascH: formData.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells?.selected && 
                      formData.paptest2Data.results.epithelialAbnormalities.squamousCells.atypicalCells.type === 'asc-h',
                lsil: formData.paptest2Data.results.epithelialAbnormalities.squamousCells.lsil || false,
                hsil: formData.paptest2Data.results.epithelialAbnormalities.squamousCells.hsil || false,
                hsilExtensive: false, // Default value
                invasionSuspected: formData.paptest2Data.results.epithelialAbnormalities.squamousCells.invasionSuspected || false,
                squamousCellCarcinoma: formData.paptest2Data.results.epithelialAbnormalities.squamousCells.carcinoma || false
              } : null,
              glandular: formData.paptest2Data.results.epithelialAbnormalities?.glandularCells?.selected ? {
                atypical: {
                  // Use the individual field values, not the 'selected' property
                  endocervical: formData.paptest2Data.results.epithelialAbnormalities.glandularCells.atypical?.endocervical || false,
                  endometrial: formData.paptest2Data.results.epithelialAbnormalities.glandularCells.atypical?.endometrial || false,
                  glandular: formData.paptest2Data.results.epithelialAbnormalities.glandularCells.atypical?.glandular || false,
                  neoplastic: formData.paptest2Data.results.epithelialAbnormalities.glandularCells.atypical?.neoplastic || false
                },
                endocervicalAdenocarcinomaInSitu: formData.paptest2Data.results.epithelialAbnormalities.glandularCells.adenocarcinomaInSitu || false,
                adenocarcinoma: {
                  // Use the individual field values, not the 'selected' property
                  endocervical: formData.paptest2Data.results.epithelialAbnormalities.glandularCells.adenocarcinoma?.endocervical || false,
                  endometrial: formData.paptest2Data.results.epithelialAbnormalities.glandularCells.adenocarcinoma?.endometrial || false
                },
                otherMalignancy: formData.paptest2Data.results.epithelialAbnormalities.glandularCells.otherMalignancy || ''
              } : null
            } : null
          },
          recommendations: {
            repeatAfterTreatment: formData.paptest2Data.recommendations?.repeatAfterTreatment || false,
            repeatAfter: {
              months: formData.paptest2Data.recommendations?.repeatAfterPeriod?.months ? 
                      parseInt(formData.paptest2Data.recommendations.repeatAfterPeriod.months) : null,
              years: formData.paptest2Data.recommendations?.repeatAfterPeriod?.years ? 
                      parseInt(formData.paptest2Data.recommendations.repeatAfterPeriod.years) : null
            },
            hpvTyping: formData.paptest2Data.recommendations?.hpvTyping || false,
            colposcopy: formData.paptest2Data.recommendations?.colposcopy || false,
            biopsy: formData.paptest2Data.recommendations?.biopsy || false
          },
          comments: formData.paptest2Data.comments || ''
        };
        
        console.log('Transformed PapTest2 data:', transformedData);
        cleanPayload.paptest2Data = transformedData;
      }
      
      console.log('Submitting report payload:', JSON.stringify(cleanPayload, null, 2));
      
      let response;
      if (selectedReport && selectedReport._id) {
        response = await updateReport(selectedReport._id, cleanPayload);
        console.log('Update response:', response);
      } else {
        response = await createReport(cleanPayload);
        console.log('Create response:', response);
      }
      
      onSuccess(`Report ${status === 'Completed' ? 'completed' : 'saved'} successfully`);
    } catch (error) {
      console.error('Error submitting report:', error);
      onError(`Failed to submit report: ${error.message}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Form Area - 2/3 width */}
      <div className="md:col-span-2">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="examination">Examination Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic">
              <BasicInfoForm formData={formData} handleChange={handleChange} />
            </TabsContent>

            <TabsContent value="examination">
              <ExaminationDetails
                formData={formData}
                handleChange={handleChange}
                handlePapTest2Change={handlePapTest2Change}
                handleSubmit={handleSubmit}
              />
            </TabsContent>
          </Tabs>
        </form>
      </div>

      {/* Template Section - 1/3 width */}
      <div className="md:col-span-1">
        <TemplateSection
          formData={formData}
          filteredTemplates={filteredTemplates}
          handleTemplateChange={handleTemplateChange}
          templateName={templateName}
          setTemplateName={setTemplateName}
          handleSaveTemplate={handleSaveTemplate}
        />
      </div>
    </div>
  );
};

export default EditForm;