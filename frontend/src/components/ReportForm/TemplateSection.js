import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { BookTemplate, Save, FileText } from 'lucide-react';
import  Button  from '../ui/button';

const TemplateSection = ({ formData, filteredTemplates, handleTemplateChange, templateName, setTemplateName, handleSaveTemplate }) => {
  return (
    <Card className="h-full shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <BookTemplate className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">Templates</CardTitle>
            <CardDescription className="mt-1">Select or create a template</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
            <FileText className="h-4 w-4 text-purple-600" />
            <span>Select Template ({filteredTemplates.length} available)</span>
          </label>
          <select
            name="templateId"
            value={formData.templateId}
            onChange={handleTemplateChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 bg-white border transition-colors"
          >
            <option value="">Select Template</option>
            {filteredTemplates.map((template) => (
              <option key={template._id} value={template._id}>{template.name}</option>
            ))}
          </select>
        </div>
        
        <div className="pt-4 border-t border-gray-200 space-y-4">
          <h3 className="flex items-center space-x-2 text-sm font-semibold text-gray-900">
            <Save className="h-4 w-4 text-purple-600" />
            <span>Save as Template</span>
          </h3>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 px-3 py-2 border transition-colors"
            placeholder="Enter template name"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveTemplate}
            className="flex items-center gap-2 w-full justify-center border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Save className="h-4 w-4" />
            Save Template
          </Button>
          <p className="text-xs text-gray-500 text-center">Save current fields as a template for future use</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSection;