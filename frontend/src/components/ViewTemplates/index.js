// components/ViewTemplates/index.js
import React, { useEffect, useState } from 'react';
import { getTemplates, deleteTemplate } from '../../services/api';
import { Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  Activity,
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import Button from "../ui/button";
import TemplateCard from './TemplateCard';
import DeleteConfirmModal from './DeleteConfirmModal';

const ViewTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTemplates();
      // Handle the response which is already processed by axios interceptor
      const templatesData = Array.isArray(response) ? response : [];
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to load templates');
      setTemplates([]); // Initialize with empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (template) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTemplate || !selectedTemplate._id) return;
    
    try {
      setIsDeleting(true);
      await deleteTemplate(selectedTemplate._id);
      
      // Update the templates list after successful deletion
      setTemplates(prevTemplates => 
        prevTemplates.filter(template => template._id !== selectedTemplate._id)
      );
      
      setIsDeleteModalOpen(false);
      setSelectedTemplate(null);
      setError(null);
    } catch (error) {
      console.error('Error deleting template:', error);
      setError('Failed to delete template: ' + (error.message || 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedTemplate(null);
    setError(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto p-6 space-y-6 flex-grow">
        {/* Back Navigation */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
            <p className="text-gray-500">Manage your report templates</p>
          </div>
          <Link to="/add-template">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </Link>
        </div>

        {/* Templates Grid */}
        {Array.isArray(templates) && templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard 
                key={template._id} 
                template={template} 
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No templates available</p>
              <Link to="/add-template">
                <Button>Create First Template</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && !isDeleteModalOpen && (
          <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
          templateName={selectedTemplate?.name || ''}
          isDeleting={isDeleting}
          error={error}
        />
      </div>
    </div>
  );
};

export default ViewTemplates;