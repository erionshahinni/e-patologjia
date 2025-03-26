// components/Dashboard/DeleteModal.js - UPDATED
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationCircleIcon, KeyIcon } from '@heroicons/react/24/outline';

const DeleteModal = ({ 
  isOpen, 
  closeModal, 
  selectedPatientId, 
  pin, 
  setPin, 
  pinError, 
  isDeleting,
  handleDelete 
}) => {
  // Local state to track input validation
  const [localPinError, setLocalPinError] = useState('');

  const validateAndSubmit = () => {
    // Reset error states
    setLocalPinError('');
    
    // Basic validation
    if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
      setLocalPinError('PIN duhet të jetë një numër 4-shifror');
      return;
    }
    
    // Call the parent handler
    handleDelete(selectedPatientId, pin);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  Largo Pacientin
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    A je i sigurt qe deshironi te largoni pacientin? Ky veprim nuk mund te kthehet.
                  </p>
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
                          (pinError || localPinError) ? 'border-red-300 pr-10' : 'border-gray-300'
                        }`}
                        placeholder="Shkruaj PIN-in"
                        value={pin}
                        onChange={(e) => {
                          setPin(e.target.value);
                          // Clear error when user types
                          setLocalPinError('');
                        }}
                        disabled={isDeleting}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {(pinError || localPinError) ? (
                          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                        ) : (
                          <KeyIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {(pinError || localPinError) && (
                      <p className="mt-2 text-sm text-red-600" id="pin-error">
                        {pinError || localPinError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                    disabled={isDeleting}
                  >
                    Anulo
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
                    onClick={validateAndSubmit}
                    disabled={isDeleting || !pin || pin.length < 4}
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Duke fshirë...
                      </>
                    ) : (
                      'Largo'
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

export default DeleteModal;