// components/ViewReport/PdfPreviewSection.js
import React from 'react';
import { Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const PdfPreviewSection = ({ onPreview }) => {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Report PDF</CardTitle>
          <CardDescription>Preview or download the report in PDF format</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onPreview('electronic')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Electronic Version
            </button>
            <button
              onClick={() => onPreview('physical')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Printed Version
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PdfPreviewSection;