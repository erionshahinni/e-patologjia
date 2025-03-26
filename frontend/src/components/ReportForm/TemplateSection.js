import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { BookTemplate, Save } from 'lucide-react';
import  Button  from '../ui/button';

const TemplateSection = ({ formData, filteredTemplates, handleTemplateChange, templateName, setTemplateName, handleSaveTemplate }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookTemplate className="h-5 w-5 text-blue-500" />
          Templates
        </CardTitle>
        <CardDescription>Select or create a template</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select Template ({filteredTemplates.length} available)</label>
          <select
            name="templateId"
            value={formData.templateId}
            onChange={handleTemplateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Template</option>
            {filteredTemplates.map((template) => (
              <option key={template._id} value={template._id}>{template.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-4">
          <h3 className="text-md font-medium text-blue-800">Save as Template</h3>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter template name"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveTemplate}
            className="flex items-center gap-2 w-full justify-center"
          >
            <Save className="h-4 w-4" />
            Save Template
          </Button>
          <p className="text-xs text-blue-600 text-center">Save current fields as a template for future use</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSection;