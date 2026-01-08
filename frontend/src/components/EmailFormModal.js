// components/EmailFormModal.js
import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Mail, X, Send, Loader } from 'lucide-react';
import { openOutlookWithAttachment } from '../services/api';

const EmailFormModal = ({ isOpen, onClose, report, pdfBlob, previewType }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Ju lutem shkruani një email të vlefshëm');
      return;
    }

    if (!pdfBlob) {
      setError('PDF nuk është gati për dërgim');
      return;
    }

    try {
      setLoading(true);
      const filename = `${report.patientId?.lastName || 'Report'}-${report.reportType || 'Report'}.pdf`;
      const includeLogos = previewType === 'electronic';
      
      // Call backend to open Outlook with attachment
      await openOutlookWithAttachment(report._id, email, pdfBlob, filename, includeLogos);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setEmail('');
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error opening Outlook:', error);
      setError(error.response?.data?.message || 'Gabim në hapjen e Outlook. Ju lutem sigurohuni që Outlook është i instaluar.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setEmail('');
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-indigo-600" />
                    Dërgo Email me PDF
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    disabled={loading}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {success ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <Send className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-green-600 font-medium">Outlook u hap me sukses!</p>
                    <p className="text-sm text-gray-600 mt-2">PDF është bashkangjitur automatikisht. Ju vetëm duhet të klikoni "Send" në Outlook.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Adresa
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        required
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Outlook do të hapet automatikisht</strong> me email të ri dhe <strong>PDF do të bashkangjitet automatikisht</strong>. Ju vetëm duhet të shkruani email-in dhe të klikoni "Send" në Outlook.
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anulo
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !email}
                        className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading ? (
                          <>
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Duke dërguar...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Dërgo
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EmailFormModal;
