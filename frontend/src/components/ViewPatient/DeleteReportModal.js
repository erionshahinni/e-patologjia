// components/ViewPatient/DeleteReportModal.js
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationCircleIcon, KeyIcon } from '@heroicons/react/24/outline';

const DeleteReportModal = ({ isOpen, onClose, onConfirm, error }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleDelete = async () => {
    // Reset error state
    setLocalError('');
    
    // Validate PIN
    if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
      setLocalError('PIN duhet të jetë një numër 4-shifror');
      return;
    }

    // Set loading state
    setLoading(true);

    try {
      // Call the parent component's onConfirm with the PIN
      await onConfirm(pin);
      
      // Reset the form and close the modal on success
      setPin('');
      onClose();
    } catch (error) {
      console.error('Error in delete operation:', error);
      setLocalError(error.message || 'An error occurred during deletion');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setPin('');
    setLocalError('');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
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
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Fshij Raportin
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    A jeni i sigurt që dëshironi të fshini raportin? Ky veprim nuk mund të kthehet.
                  </p>
                </div>

                {(error || localError) && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
                    {error || localError}
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Shkruaj PIN-in për të konfirmuar:
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      pattern="[0-9]*"
                      className={`block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                        (error || localError) ? 'border-red-300 pr-10' : 'border-gray-300'
                      }`}
                      placeholder="Shkruaj PIN-in"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        // Clear error when user types
                        setLocalError('');
                      }}
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {(error || localError) ? (
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                      ) : (
                        <KeyIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Anulo
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
                    onClick={handleDelete}
                    disabled={loading || !pin || pin.length < 4}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Duke fshirë...
                      </>
                    ) : (
                      'Fshij'
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteReportModal;