// components/ViewTemplates/TemplateCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Edit, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import Button from "../ui/button";

const TemplateCard = ({ template, onDeleteClick }) => {
  if (!template) return null;

  return (
    <Card className="hover:border-blue-500 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-50">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle>{template.name || 'Untitled Template'}</CardTitle>
              <CardDescription>{template.reportType || 'No type specified'}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/edit-template/${template._id}`}>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDeleteClick(template)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Common Fields */}
          {template.diagnosis && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Clinical Diagnosis</h4>
              <p className="mt-1 text-sm text-gray-700">{template.diagnosis}</p>
            </div>
          )}

          {template.sample && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Sample</h4>
              <p className="mt-1 text-sm text-gray-700">{template.sample}</p>
            </div>
          )}

          {/* Biopsy Specific Fields */}
          {template.reportType === 'Biopsy' && (
            <>
              {template.histopathologicalDiagnosis && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Histopathological Diagnosis</h4>
                  <p className="mt-1 text-sm text-gray-700">{template.histopathologicalDiagnosis}</p>
                </div>
              )}
              {template.microscopicExamination && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Microscopic Examination</h4>
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                    {template.microscopicExamination}
                  </p>
                </div>
              )}
              {template.macroscopicExamination && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Macroscopic Examination</h4>
                  <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                    {template.macroscopicExamination}
                  </p>
                </div>
              )}
            </>
          )}

          {/* PapTest and Cytology Specific Fields */}
          {(template.reportType === 'PapTest' || template.reportType === 'Cytology' || template.reportType === 'PapTest2') && 
           template.cytologicalExamination && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Cytological Examination</h4>
              <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                {template.cytologicalExamination}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;