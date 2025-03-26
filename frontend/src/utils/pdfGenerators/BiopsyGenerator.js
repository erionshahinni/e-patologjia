// utils/pdfGenerators/BiopsyGenerator.js
import BasePdfGenerator from './BasePdfGenerator';

class BiopsyGenerator extends BasePdfGenerator {
  constructor(report, includeLogoSignature = true) {
    super(report, includeLogoSignature);
  }

  async generatePDF() {
    // Title for Biopsy
    this.yPosition += 10;
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(128, 0, 128);
    this.doc.text('RAPORTI PATOLOGJIK', this.pageWidth / 2, this.yPosition, { align: 'center' });
    this.doc.setTextColor(0, 0, 0);
    
    // Add purple line below title
    this.yPosition += 5;
    this.doc.setDrawColor(128, 0, 128);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.yPosition, this.margin + this.tableWidth, this.yPosition);
    this.doc.setDrawColor(0, 0, 0);
    
    this.yPosition += 3; // Space after line

    // Add purple line after diagnosis
    this.yPosition += 5;
    this.doc.setDrawColor(128, 0, 128);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.yPosition, this.margin + this.tableWidth, this.yPosition);
    this.doc.setDrawColor(0, 0, 0);
    
    this.yPosition += 5; // Space after line
    
    // Add diagnosis section
    this.addRow('Diagnoza histopatologjike: ', this.report.histopathologicalDiagnosis, true);
    
    // Add purple line after diagnosis
    this.yPosition += 5;
    this.doc.setDrawColor(128, 0, 128);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.yPosition, this.margin + this.tableWidth, this.yPosition);
    this.doc.setDrawColor(0, 0, 0);
    
    this.yPosition += 5; // Space after line
    
    // Add microscopic examination with increased spacing
    this.addRow('Ekzaminimi mikroskopik: ', this.report.microscopicExamination, true);
    this.yPosition += 5; // Extra space
    
    // Add macroscopic examination with increased spacing
    this.addRow('Ekzaminimi makroskopik: ', this.report.macroscopicExamination, true);
    this.yPosition += 5; // Extra space
    
    // Add sample
    this.addRow('Mostra: ', this.report.sample, true);
  }
}

export default BiopsyGenerator;