// components/ViewTemplates/TemplateCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Edit, Trash2, ClipboardList, FlaskConical, Microscope, Eye, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Card,
  CardContent,
} from "../ui/card";
import Button from "../ui/button";

const TemplateCard = ({ template, onDeleteClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!template) return null;

  return (
    <div className="space-y-0">
      {/* Compact Template Card - Clickable */}
      <Card 
        className="hover:shadow-md transition-all border border-gray-200 shadow-sm cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-sm">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{template.name || 'Untitled Template'}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <Activity className="h-3 w-3" />
                  {template.reportType || 'No type specified'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                to={`/edit-template/${template._id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(template);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="ml-2">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expandable Details Section */}
      {isExpanded && (
        <div className="mt-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            {/* Common Fields */}
            {template.diagnosis && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-sm font-semibold text-gray-700">Clinical Diagnosis</h4>
                </div>
                <p className="text-sm text-gray-600 ml-6">{template.diagnosis}</p>
              </div>
            )}

            {template.sample && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-sm font-semibold text-gray-700">Sample</h4>
                </div>
                <p className="text-sm text-gray-600 ml-6">{template.sample}</p>
              </div>
            )}

            {/* Biopsy Specific Fields */}
            {template.reportType === 'Biopsy' && (
              <>
                {template.histopathologicalDiagnosis && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="h-4 w-4 text-indigo-600" />
                      <h4 className="text-sm font-semibold text-gray-700">Histopathological Diagnosis</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{template.histopathologicalDiagnosis}</p>
                  </div>
                )}
                {template.microscopicExamination && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Microscope className="h-4 w-4 text-indigo-600" />
                      <h4 className="text-sm font-semibold text-gray-700">Microscopic Examination</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-6 whitespace-pre-wrap">
                      {template.microscopicExamination}
                    </p>
                  </div>
                )}
                {template.macroscopicExamination && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-indigo-600" />
                      <h4 className="text-sm font-semibold text-gray-700">Macroscopic Examination</h4>
                    </div>
                    <p className="text-sm text-gray-600 ml-6 whitespace-pre-wrap">
                      {template.macroscopicExamination}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* PapTest and Cytology Specific Fields */}
            {(template.reportType === 'PapTest' || template.reportType === 'Cytology' || template.reportType === 'PapTest2') && 
             template.cytologicalExamination && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Microscope className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-sm font-semibold text-gray-700">Cytological Examination</h4>
                </div>
                <p className="text-sm text-gray-600 ml-6 whitespace-pre-wrap">
                  {template.cytologicalExamination}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCard;