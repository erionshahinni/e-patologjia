// components/PDFReportGenerator.js
import React, { useEffect, useRef, useState } from 'react';
import PDFGeneratorFactory from '../utils/pdfGenerators/PDFGeneratorFactory';
import EmailFormModal from './EmailFormModal';

// Utility function for generating and downloading PDF
export const generateAndDownloadPDF = async (report, includeLogoSignature = true) => {
  try {
    // Create the appropriate generator based on the report type
    const generator = PDFGeneratorFactory.createGenerator(report, includeLogoSignature);
    
    // Generate the PDF document
    const doc = await generator.createPDF();
    
    if (doc) {
      // Save the PDF
      const fileName = `${report.patientId.lastName}-${report.reportType}-${includeLogoSignature ? 'Electronic' : 'Physical'}.pdf`;
      doc.save(fileName);
    }
  } catch (error) {
    console.error('Error generating PDF for download:', error);
    alert('Error generating PDF. Please try again.');
  }
};

const PDFReportGenerator = ({ report, previewMode = false, previewType = 'electronic', onPreviewReady, onClose }) => {
  const pdfCanvasRef = useRef(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    if (previewMode && pdfCanvasRef.current) {
      const renderPreview = async () => {
        try {
          // Clear any existing content
          if (pdfCanvasRef.current) {
            const canvasContainer = pdfCanvasRef.current;
            while (canvasContainer.firstChild) {
              canvasContainer.removeChild(canvasContainer.firstChild);
            }
          }

          // Create loading indicator
          const loadingDiv = document.createElement('div');
          loadingDiv.className = 'text-center my-8';
          loadingDiv.innerHTML = '<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div><p class="mt-2 text-gray-500">Loading PDF preview...</p>';
          pdfCanvasRef.current.appendChild(loadingDiv);

          // Generate the PDF using the factory
          const includeLogos = previewType === 'electronic';
          const generator = PDFGeneratorFactory.createGenerator(report, includeLogos);
          const doc = await generator.createPDF();
          
          if (!doc) {
            console.error('PDF document creation failed');
            if (onPreviewReady) onPreviewReady();
            return;
          }
          
          // Get PDF as blob for more reliable rendering
          const pdfBlob = doc.output('blob');
          setPdfBlob(pdfBlob);
          const pdfUrl = URL.createObjectURL(pdfBlob);
          
          // Create an iframe to display the PDF
          const iframe = document.createElement('iframe');
          iframe.className = 'w-full h-full border-0';
          iframe.style.height = '800px'; // Fixed height
          iframe.style.width = '100%';
          iframe.src = pdfUrl;
          
          // When iframe loads, remove loading indicator
          iframe.onload = () => {
            if (pdfCanvasRef.current && pdfCanvasRef.current.contains(loadingDiv)) {
              pdfCanvasRef.current.removeChild(loadingDiv);
            }
            if (onPreviewReady) {
              onPreviewReady();
            }
          };
          
          // Handle loading errors
          iframe.onerror = (error) => {
            console.error('Error loading PDF in iframe:', error);
            if (pdfCanvasRef.current && pdfCanvasRef.current.contains(loadingDiv)) {
              pdfCanvasRef.current.removeChild(loadingDiv);
            }
            
            // Add an error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-center my-8 text-red-500';
            errorDiv.innerHTML = '<p>Error loading PDF preview. Please try downloading instead.</p>';
            if (pdfCanvasRef.current) {
              pdfCanvasRef.current.appendChild(errorDiv);
            }
            
            if (onPreviewReady) {
              onPreviewReady();
            }
          };
          
          // Append the iframe to the container
          if (pdfCanvasRef.current) {
            pdfCanvasRef.current.appendChild(iframe);
          }
          
          // Cleanup function to revoke object URL when component unmounts
          return () => {
            URL.revokeObjectURL(pdfUrl);
          };
        } catch (error) {
          console.error('Error rendering PDF preview:', error);
          
          // Display error message
          if (pdfCanvasRef.current) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-center my-8 text-red-500';
            errorDiv.innerHTML = '<p>Error rendering PDF preview. Please try downloading instead.</p>';
            pdfCanvasRef.current.appendChild(errorDiv);
          }
          
          if (onPreviewReady) {
            onPreviewReady();
          }
        }
      };
      
      renderPreview();
    }
  }, [previewMode, previewType, report, onPreviewReady]);

  const handleSendEmail = () => {
    if (!pdfBlob) {
      alert('PDF is not ready to be sent.');
      return;
    }
    setIsEmailModalOpen(true);
  };

  if (previewMode) {
    return (
      <>
        <div className="pdf-preview-container w-full" style={{ minHeight: '800px' }}>
          <div ref={pdfCanvasRef} style={{ minHeight: '800px' }}>
            {/* PDF will be rendered here */}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700"
            >
              Close
            </button>
            <button
              onClick={() => generateAndDownloadPDF(report, previewType === 'electronic')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Download
            </button>
            <button
              onClick={handleSendEmail}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Send to Email
            </button>
          </div>
        </div>
        <EmailFormModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          report={report}
          pdfBlob={pdfBlob}
          previewType={previewType}
        />
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => generateAndDownloadPDF(report, true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Version Elektronike
        </button>
        <button
          onClick={() => generateAndDownloadPDF(report, false)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          Version i Printuar
        </button>
      </div>
    </div>
  );
};

export default PDFReportGenerator;