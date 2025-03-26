// components/ReportForm/index.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPatientById, getTemplates } from '../../services/api';
import { ArrowLeft, Activity, UserCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import BasicInfoForm from './BasicInfoForm';
import ExaminationDetails from './ExaminationDetails';
import TemplateSection from './TemplateSection';
import SuccessModal from './SuccessModal';
import ErrorModal from './ErrorModal';

const ReportForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [allTemplates, setAllTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [templateName, setTemplateName] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isTemplateSuccessModalOpen, setIsTemplateSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [formData, setFormData] = useState({
    patientId: id,
    reportType: '',
    referenceNumber: '',
    healthcareInstitution: '',
    referringDoctor: '',
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
        selected: '',
        otherText: ''
      },
      sampleQuality: {
        selected: ''
      },
      results: {
        selected: '',
        epithelialAbnormalities: {
          squamousCells: {
            selected: false,
            atypicalCells: {
              selected: false,
              type: ''
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
  });

  // Fetch patient and templates data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [patientResponse, templatesResponse] = await Promise.all([
          getPatientById(id),
          getTemplates()
        ]);

        if (patientResponse) {
          setPatient(patientResponse);
        }

        const templates = templatesResponse || [];
        setAllTemplates(templates);

        const biopsyTemplates = templates.filter(template =>
          template && template.reportType === 'Biopsy'
        );
        setFilteredTemplates(biopsyTemplates);

        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setModalMessage(error.message || 'Failed to load necessary data');
        setIsErrorModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Update filtered templates when report type changes
  useEffect(() => {
    if (Array.isArray(allTemplates) && allTemplates.length > 0) {
      const filtered = allTemplates.filter(template =>
        template && template.reportType === formData.reportType
      );
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates([]);
    }
  }, [formData.reportType, allTemplates]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : '') : value
    }));
  };

  const handlePapTest2Change = (section, value) => {
    setFormData(prev => ({
      ...prev,
      paptest2Data: {
        ...prev.paptest2Data,
        [section]: value
      }
    }));
  };

  // Handle template selection
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

    const selectedTemplate = filteredTemplates.find(template => template._id === templateId);
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        diagnosis: selectedTemplate.diagnosis || selectedTemplate.histopathologicalDiagnosis || '',
        microscopicExamination: selectedTemplate.microscopicExamination || '',
        macroscopicExamination: selectedTemplate.macroscopicExamination || '',
        sample: selectedTemplate.sample || `${formData.reportType} sample from template`,
        cytologicalExamination: selectedTemplate.cytologicalExamination || '',
        histopathologicalDiagnosis: selectedTemplate.histopathologicalDiagnosis || '',
        templateId: selectedTemplate._id,
      }));
    }
  };

  // Import the handlers from the helper functions
  const { handleSaveTemplate, handleSubmit } = require('./utils').useReportHandlers({
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
  });

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate(`/view-patient/${id}`);
  };

  const handleCloseTemplateSuccessModal = () => {
    setIsTemplateSuccessModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Patient not found</p>
            <Link to="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              Return to Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto p-6 space-y-6 flex-grow">
        <Link
          to={`/view-patient/${id}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patient
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Report</h1>
              <p className="text-gray-500">
                for {patient.firstName} {patient.lastName}
              </p>
            </div>
          </div>
        </div>

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

        {/* Success dialog for Report */}
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleCloseSuccessModal}
          message={modalMessage}
        />

        {/* Success dialog for Template */}
        <SuccessModal
          isOpen={isTemplateSuccessModalOpen}
          onClose={handleCloseTemplateSuccessModal}
          message={modalMessage}
        />

        {/* Error dialog */}
        <ErrorModal
          isOpen={isErrorModalOpen}
          onClose={() => setIsErrorModalOpen(false)}
          message={modalMessage}
        />
      </div>
    </div>
  );
};

export default ReportForm;