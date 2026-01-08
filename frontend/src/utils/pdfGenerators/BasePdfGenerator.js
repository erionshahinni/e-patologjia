// utils/pdfGenerators/BasePdfGenerator.js
import { jsPDF } from "jspdf";
import logo from '../../components/logo1.png';
import vulaStamp from '../../components/vula1.png';
import pathologyLogo from '../../components/pathology.png';

class BasePdfGenerator {
  constructor(report, includeLogoSignature = true) {
    this.report = report;
    this.includeLogoSignature = includeLogoSignature;
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 30;
    this.tableWidth = 150;
    this.yPosition = 45; // Reduced from 50 to save space
    this.labelWidth = 45;
    this.contentWidth = this.tableWidth - this.labelWidth;
    this.lineHeight = 4; // Reduced from 5 to save space

    // Initialize the document with common settings
    this.doc.addFont('helvetica', 'Arial');
  }

  // Helper method to calculate text height with reduced line height
  calculateTextHeight(text, width, fontSize) {
    this.doc.setFontSize(fontSize);
    const splitText = this.doc.splitTextToSize(text || '', width - 4);
    return splitText.length * this.lineHeight;
  }

  // Helper method to add page break if needed - we'll try to avoid this
  checkAndAddPage(requiredSpace) {
    if (this.yPosition + requiredSpace > this.pageHeight - 70) { // Give more space for footer
      // Instead of adding a page, try to compress content
      this.lineHeight = 3.5;
      // If we still need more space, reluctantly add a page
      if (this.yPosition + requiredSpace > this.pageHeight - 70) {
        this.doc.addPage();
        this.yPosition = 20;
        this.lineHeight = 4;
      }
    }
  }

  // Helper method to add a row to the PDF with compact design
  addRow(label, content, isFullWidth = false) {
    this.doc.setFontSize(9); // Reduced from 10 to save space
    
    const contentBoxWidth = isFullWidth ? this.tableWidth : this.contentWidth;
    const contentCellWidth = isFullWidth ? this.tableWidth - this.labelWidth : this.contentWidth;
    
    // Split content into lines
    let splitContent = [];
    let textHeight = 0;
    if (content) {
      splitContent = this.doc.splitTextToSize(content || '', contentCellWidth - 4);
      textHeight = splitContent.length * this.lineHeight;
    }
    
    const rowHeight = Math.max(6, textHeight + 3); // Reduced minimum height
    
    this.checkAndAddPage(rowHeight);
    
    const currentX = this.margin + (isFullWidth ? 0 : this.labelWidth);
    
    // Draw label cell
    this.doc.setFont('Arial', 'bold');
    this.doc.rect(this.margin, this.yPosition, this.labelWidth, rowHeight);
    // Center label vertically if content is multi-line
    const labelY = splitContent.length > 1 ? this.yPosition + rowHeight / 2 : this.yPosition + 4;
    this.doc.text(label, this.margin + 2, labelY);
    
    // Draw content cell
    const contentX = this.margin + this.labelWidth;
    this.doc.rect(contentX, this.yPosition, contentCellWidth, rowHeight);
    
    // Render content with proper line spacing
    if (content && splitContent.length > 0) {
      this.doc.setFont('Arial', 'normal');
      // Render each line with proper spacing
      splitContent.forEach((line, index) => {
        const lineY = this.yPosition + 4 + (index * this.lineHeight);
        this.doc.text(line, contentX + 2, lineY);
      });
    }
    
    this.yPosition += rowHeight;
  }

  // Helper method to add a split row to the PDF with compact design
  addSplitRow(leftLabel, leftContent, rightLabel, rightContent) {
    this.doc.setFontSize(9); // Reduced from 10 to save space
    
    const contentBoxWidth = this.tableWidth / 2 - this.labelWidth;
    const leftTextHeight = this.calculateTextHeight(leftContent, contentBoxWidth, 9);
    const rightTextHeight = this.calculateTextHeight(rightContent, contentBoxWidth, 9);
    const rowHeight = Math.max(6, Math.max(leftTextHeight, rightTextHeight) + 3); // Reduced minimum height
    
    this.checkAndAddPage(rowHeight);
    
    this.doc.setFont('Arial', 'bold');
    this.doc.rect(this.margin, this.yPosition, this.labelWidth, rowHeight);
    this.doc.text(leftLabel, this.margin + 2, this.yPosition + 4);
    
    const leftContentWidth = this.tableWidth / 2 - this.labelWidth;
    this.doc.rect(this.margin + this.labelWidth, this.yPosition, leftContentWidth, rowHeight);
    if (leftContent) {
      this.doc.setFont('Arial', 'normal');
      const splitLeftContent = this.doc.splitTextToSize(leftContent, leftContentWidth - 4);
      this.doc.text(splitLeftContent, this.margin + this.labelWidth + 2, this.yPosition + 4);
    }
    
    const rightX = this.margin + this.tableWidth / 2;
    this.doc.setFont('Arial', 'bold');
    this.doc.rect(rightX, this.yPosition, this.labelWidth, rowHeight);
    this.doc.text(rightLabel, rightX + 2, this.yPosition + 4);
    
    const rightContentX = rightX + this.labelWidth;
    this.doc.rect(rightContentX, this.yPosition, leftContentWidth, rowHeight);
    if (rightContent) {
      this.doc.setFont('Arial', 'normal');
      const splitRightContent = this.doc.splitTextToSize(rightContent, leftContentWidth - 4);
      this.doc.text(splitRightContent, rightContentX + 2, this.yPosition + 4);
    }
    
    this.yPosition += rowHeight;
  }

  // Method to add a section header with compact design
  addSectionHeader(text) {
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(9);
    this.doc.rect(this.margin, this.yPosition, this.tableWidth, 7); // Reduced from 8
    this.doc.text(text, this.margin + 2, this.yPosition + 4);
    this.yPosition += 7;
  }

  // Method to add the pathologist section, positioned near the footer
  async addPathologistSection() {
    // Position the pathologist section near the footer
    const footerStartY = this.pageHeight - 50; // Start position for footer area
    
    // Jump to fixed position for pathologist section
    this.yPosition = footerStartY - 45; // Positioning above the footer
    
    // Add pathologist label and line consistently for both versions
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(9);
    // this.doc.text('Patologu:', this.margin, this.yPosition);
    
    this.yPosition += 35;
    this.doc.setLineWidth(0.2);
    this.doc.line(this.margin, this.yPosition, this.margin + this.tableWidth, this.yPosition);
    
    if (this.includeLogoSignature) {
      try {
        // Add background images
        const vulaImg = new Image();
        vulaImg.src = vulaStamp;
        await new Promise((resolve) => {
          vulaImg.onload = resolve;
        });
        const vulaCanvas = document.createElement('canvas');
        vulaCanvas.width = vulaImg.width;
        vulaCanvas.height = vulaImg.height;
        const vulaCtx = vulaCanvas.getContext('2d');
        vulaCtx.drawImage(vulaImg, 0, 0);
        const vulaImageData = vulaCanvas.toDataURL('image/png');
        this.doc.addImage(vulaImageData, 'PNG', this.margin, this.yPosition - 13, 35, 35);

        const pathologyImg = new Image();
        pathologyImg.src = pathologyLogo;
        await new Promise((resolve) => {
          pathologyImg.onload = resolve;
        });
        const pathologyCanvas = document.createElement('canvas');
        pathologyCanvas.width = pathologyImg.width;
        pathologyCanvas.height = pathologyImg.height;
        const pathologyCtx = pathologyCanvas.getContext('2d');
        pathologyCtx.drawImage(pathologyImg, 0, 0);
        const pathologyImageData = pathologyCanvas.toDataURL('image/png');
        this.doc.addImage(pathologyImageData, 'PNG', this.margin + this.tableWidth - 35, this.yPosition - 13, 35, 35);
      } catch (error) {
        console.error('Error adding pathologist section images:', error);
      }
    }
    this.doc.text('Patologu:', this.margin, this.yPosition -3);

    this.yPosition += 5;
  this.doc.setFont('Arial', 'normal');
  const doctorName = 'Prof. Ass. Dr. Labinot Shahini, MD, PhD';
  
  // Move text slightly from the left margin towards the center
  const offsetFromMargin = this.margin + (this.tableWidth * 0.2); // 20% of table width from the left margin
  this.doc.text(doctorName, offsetFromMargin, this.yPosition);
}
  // Method to add footer on all pages (reimplemented to use 3 columns)
  setupFooterOnAllPages() {
    if (!this.includeLogoSignature) return;

    // Store the original addPage function
    const originalAddPage = this.doc.addPage;
    
    // Function to add footer to current page (in 3 columns)
    const addFooterToCurrentPage = () => {
      const footerY = this.pageHeight - 22; // Position closer to bottom
      this.doc.setFont('Arial', 'normal');
      this.doc.setFontSize(8);
      
      this.doc.setDrawColor(128, 0, 128);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, footerY - 8, this.margin + this.tableWidth, footerY - 8);
      this.doc.setDrawColor(0, 0, 0);
      
      // Column 1 - Lab name and address 'Ulpiana, D-8 H3, Nr. 10\n 10 000 Prishtine, Kosove', 
      this.doc.text('Ulpiana, D-8 H3, Nr. 10\n 10 000 Prishtine, Kosove',
                   this.margin, footerY, { align: 'left' });
      
      // Column 2 - Website and email 'Laboratori i patologjise "Pathology" \n T: +383 (0) 45 250 475', 
      this.doc.text('Laboratori i patologjise "Pathology" \n T: +383 (0) 45 250 475',  
                   this.pageWidth / 2, footerY, { align: 'center' });
      
      // Column 3 - Phone 'w: www.patologjia.com\n@: info@patologjia.com',
      this.doc.text('w: www.patologjia.com\n@: info@patologjia.com',
                   this.margin + this.tableWidth, footerY, { align: 'right' });
    };
    
    // Override the addPage function to automatically add footer to each new page
    this.doc.addPage = function() {
      // Call the original addPage function first
      originalAddPage.call(this);
      // Add footer to the newly added page
      addFooterToCurrentPage();
    };
    
    // Add footer to the first page as well
    addFooterToCurrentPage();
  }

  // Helper method to format referring doctors
  formatReferringDoctors(mainDoctor, additionalDoctorsJSON) {
    let doctorList = mainDoctor ? [mainDoctor] : [];
    try {
      // Parse additional doctors from JSON string
      if (additionalDoctorsJSON) {
        const additionalDoctors = JSON.parse(additionalDoctorsJSON);
        if (Array.isArray(additionalDoctors)) {
          // Filter out empty strings and add to list
          const validAdditionalDoctors = additionalDoctors.filter(doc => doc && doc.trim());
          doctorList = [...doctorList, ...validAdditionalDoctors];
        }
      }
    } catch (error) {
      console.error("Error parsing referring doctors:", error);
    }
    
    // Remove duplicates and join with commas and spaces
    return [...new Set(doctorList)].filter(doc => doc && doc.trim()).join(", ");
  }

  // Helper method to format institution with address
  formatInstitutionWithAddress(institution, address) {
    if (!institution) return "";
    if (!address) return institution;
    return `${institution}${address ? ', ' + address : ''}`;
  }

  // Common method to add header logo
  async addHeaderLogo() {
    if (this.includeLogoSignature) {
      const logoWidth = 35; // Reduced from 40
      const logoX = (this.pageWidth - logoWidth) / 2;
      const img = new Image();
      img.src = logo;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = canvas.toDataURL('image/png');
      
      this.doc.addImage(imageData, 'PNG', logoX, 15, logoWidth, 18); // Moved up and reduced height
    }
  }

  // Common method to add patient information with compact design
  addPatientInformation() {
    const { patientId, healthcareInstitution, institutionAddress, referenceNumber, finishedAt, referringDoctor, referringDoctors } = this.report;

    // First row: Healthcare Institution and Institution Address
    this.addSplitRow(
      'Institucioni Shendetesor',
      healthcareInstitution || '',
      'Adresa e Institucionit',
      institutionAddress || ''
    );

    // Second row: Patient name and Reference
    this.addSplitRow(
      'Emri',
      `${patientId.firstName} ${patientId.lastName}`,
      'Referenca',
      referenceNumber
    );

    this.addSplitRow(
      'Datelindja',
      patientId.dateOfBirth ? new Date(patientId.dateOfBirth).toLocaleDateString() : '',
      'Perfunduar me',
      finishedAt ? new Date(finishedAt).toLocaleDateString() : ''
    );

    this.addSplitRow(
      'Gjinia',
      patientId.gender,
      'Adresa',
      patientId.address
    );

    // Format referring doctors (both primary and additional)
    const allReferringDoctors = this.formatReferringDoctors(
      referringDoctor,
      referringDoctors
    );

    this.addRow(
      'Mjeku Referues',
      allReferringDoctors,
      true
    );

    this.addRow(
      'Diagnoza Klinike',
      this.report.diagnosis,
      true
    );
  }

  // Method to add footer (modified to use 3 columns)
  addFooter() {
    if (this.includeLogoSignature) {
      const footerY = this.pageHeight - 22;
      this.doc.setFont('Arial', 'normal');
      this.doc.setFontSize(8);
      
      this.doc.setDrawColor(128, 0, 128);
      this.doc.setLineWidth(0.5);
      this.doc.line(this.margin, footerY - 8, this.margin + this.tableWidth, footerY - 8);
      this.doc.setDrawColor(0, 0, 0);
      
      // Column 1 - Lab name and address
      this.doc.text('Ulpiana, D-8 H3, Nr. 10\n 10 000 Prishtine, Kosove', 
                   this.margin, footerY, { align: 'left' });
      
      // Column 2 - Website and email 
      this.doc.text('Laboratori i patologjise "Pathology" \n T: +383 (0) 45 250 475', 
                   this.pageWidth / 2, footerY, { align: 'center' });
      
      // Column 3 - Phone
      this.doc.text('w: www.patologjia.com\n@: info@patologjia.com',
                   this.margin + this.tableWidth, footerY, { align: 'right' });
    }
  }

  // Abstract method to be implemented by child classes
  async generatePDF() {
    throw new Error('Method not implemented');
  }
  
  // Final method to generate the complete PDF
  async createPDF() {
    try {
      // Add header logo
      await this.addHeaderLogo();
      
      // Setup footers
      this.setupFooterOnAllPages();
      
      // Add patient information
      this.addPatientInformation();
      
      // Generate specific report content (implemented by child classes)
      await this.generatePDF();
      
      // Add Pathologist section (now positioned just above footer)
      await this.addPathologistSection();
      
      return this.doc;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}

export default BasePdfGenerator;