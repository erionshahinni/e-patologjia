// utils/pdfGenerators/index.js
import BasePdfGenerator from './BasePdfGenerator';
import BiopsyGenerator from './BiopsyGenerator';
import PapTestGenerator from './PapTestGenerator';
import PapTest2Generator from './PapTest2Generator';
import CytologyGenerator from './CytologyGenerator';
import PDFGeneratorFactory from './PDFGeneratorFactory';

export {
  BasePdfGenerator,
  BiopsyGenerator,
  PapTestGenerator,
  PapTest2Generator,
  CytologyGenerator,
  PDFGeneratorFactory
};

// Re-export the utility functions from the PDFReportGenerator component
export { generateAndDownloadPDF } from '../../components/PDFReportGenerator';