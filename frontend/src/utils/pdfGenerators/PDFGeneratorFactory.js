// utils/pdfGenerators/PDFGeneratorFactory.js
import BiopsyGenerator from './BiopsyGenerator';
import PapTestGenerator from './PapTestGenerator';
import PapTest2Generator from './PapTest2Generator';
import CytologyGenerator from './CytologyGenerator';

class PDFGeneratorFactory {
  /**
   * Creates a PDF generator based on the report type
   * @param {Object} report - The report object
   * @param {boolean} includeLogoSignature - Whether to include logos and signatures
   * @returns {BasePdfGenerator} A PDF generator instance
   */
  static createGenerator(report, includeLogoSignature = true) {
    switch (report.reportType) {
      case 'Biopsy':
        return new BiopsyGenerator(report, includeLogoSignature);
      case 'PapTest':
        return new PapTestGenerator(report, includeLogoSignature);
      case 'PapTest2':
        return new PapTest2Generator(report, includeLogoSignature);
      case 'Cytology':
        return new CytologyGenerator(report, includeLogoSignature);
      default:
        throw new Error(`Unsupported report type: ${report.reportType}`);
    }
  }
}

export default PDFGeneratorFactory;