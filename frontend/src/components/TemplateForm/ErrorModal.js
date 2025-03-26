// components/TemplateForm/ErrorModal.js
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertCircle } from 'lucide-react';
import Button from '../ui/button';

const ErrorModal = ({ isOpen, onClose, message }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-red-600">
            <AlertCircle className="h-6 w-6" />
            Error
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="flex justify-center gap-4 pb-4">
          <Button
            onClick={onClose}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorModal;