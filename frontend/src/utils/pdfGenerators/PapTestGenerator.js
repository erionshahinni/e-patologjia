// utils/pdfGenerators/PapTestGenerator.js
import BasePdfGenerator from './BasePdfGenerator';

class PapTestGenerator extends BasePdfGenerator {
  constructor(report, includeLogoSignature = true) {
    super(report, includeLogoSignature);
  }

  async generatePDF() {
    // Title for PapTest
    this.yPosition += 10;
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(128, 0, 128);
    this.doc.text('RAPORTI CITOLOGJIK', this.pageWidth / 2, this.yPosition, { align: 'center' });
    this.doc.setTextColor(0, 0, 0);
    
    // Add purple line below title
    this.yPosition += 5;
    this.doc.setDrawColor(128, 0, 128);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.yPosition, this.margin + this.tableWidth, this.yPosition);
    this.doc.setDrawColor(0, 0, 0);
    
    this.yPosition += 10; // Space after line
  
    // Add cytological examination
    this.addRow('Ekzaminimi citologjik: ', this.report.cytologicalExamination, true);
    
    // Add extra space between examination and sample
    this.yPosition += 7;
    
    // Add sample
    this.addRow('Mostra: ', this.report.sample, true);
  }
}

export default PapTestGenerator;