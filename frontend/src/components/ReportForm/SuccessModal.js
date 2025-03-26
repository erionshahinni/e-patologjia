import React from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { CheckCircle2 } from 'lucide-react';
import Button from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "../ui/dialog";

const SuccessModal = ({ isOpen, onClose, message }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-green-600">
            <CheckCircle2 className="h-6 w-6" />
            Success
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-4">
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="flex justify-center gap-4 pb-4">
          <Button
            onClick={onClose}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <CheckCircle2 className="h-4 w-4" />
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;