import React, { useEffect, useRef, useState } from 'react';
import { jsPDF } from "jspdf";
import logo from '../components/logo1.png';
import vulaStamp from '../components/vula1.png';
import pathologyLogo from '../components/pathology.png';

// Separate utility function for generating and downloading PDF
export const generateAndDownloadPDF = async (report, includeLogoSignature = true) => {
  try {
    // Create a temporary instance for generating the PDF
    const tempDoc = await createPDFDoc(report, includeLogoSignature);
    
    if (tempDoc) {
      // Save the PDF
      const fileName = `${report.patientId.lastName}-${report.reportType}-${includeLogoSignature ? 'Electronic' : 'Physical'}.pdf`;
      tempDoc.save(fileName);
    }
  } catch (error) {
    console.error('Error generating PDF for download:', error);
    alert('Error generating PDF. Please try again.');
  }
};

// Helper function to create PDF document
export const createPDFDoc = async (report, includeLogoSignature = true) => {
  const doc = new jsPDF();
  
  doc.addFont('helvetica', 'Arial');
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 30;
  const tableWidth = 150;
  let yPosition = 50;
  const labelWidth = 45;
  const contentWidth = tableWidth - labelWidth;
  const lineHeight = 5;

  // Helper function to calculate text height
  const calculateTextHeight = (text, width, fontSize) => {
    doc.setFontSize(fontSize);
    const splitText = doc.splitTextToSize(text || '', width - 4);
    return splitText.length * lineHeight;
  };

  // Helper function to add page break if needed
  const checkAndAddPage = (requiredSpace) => {
    if (yPosition + requiredSpace > doc.internal.pageSize.getHeight() - 50) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Helper functions
  const addRow = (label, content, isFullWidth = false) => {
    doc.setFontSize(10);
    
    const contentBoxWidth = isFullWidth ? tableWidth : contentWidth;
    const textHeight = calculateTextHeight(content, contentBoxWidth, 10);
    const rowHeight = Math.max(8, textHeight + 3);
    
    checkAndAddPage(rowHeight);
    
    const currentX = margin + (isFullWidth ? 0 : labelWidth);
    
    doc.setFont('Arial', 'bold');
    doc.rect(margin, yPosition, labelWidth, rowHeight);
    doc.text(label, margin + 2, yPosition + 5);
    
    const contentX = margin + labelWidth;
    const contentCellWidth = isFullWidth ? tableWidth - labelWidth : contentWidth;
    doc.rect(contentX, yPosition, contentCellWidth, rowHeight);
    
    if (content) {
      doc.setFont('Arial', 'normal');
      const splitContent = doc.splitTextToSize(content, contentCellWidth - 4);
      doc.text(splitContent, contentX + 2, yPosition + 5);
    }
    
    yPosition += rowHeight;
  };

  const addSplitRow = (leftLabel, leftContent, rightLabel, rightContent) => {
    doc.setFontSize(10);
    
    const contentBoxWidth = tableWidth / 2 - labelWidth;
    const leftTextHeight = calculateTextHeight(leftContent, contentBoxWidth, 10);
    const rightTextHeight = calculateTextHeight(rightContent, contentBoxWidth, 10);
    const rowHeight = Math.max(8, Math.max(leftTextHeight, rightTextHeight) + 3);
    
    checkAndAddPage(rowHeight);
    
    doc.setFont('Arial', 'bold');
    doc.rect(margin, yPosition, labelWidth, rowHeight);
    doc.text(leftLabel, margin + 2, yPosition + 5);
    
    const leftContentWidth = tableWidth / 2 - labelWidth;
    doc.rect(margin + labelWidth, yPosition, leftContentWidth, rowHeight);
    if (leftContent) {
      doc.setFont('Arial', 'normal');
      const splitLeftContent = doc.splitTextToSize(leftContent, leftContentWidth - 4);
      doc.text(splitLeftContent, margin + labelWidth + 2, yPosition + 5);
    }
    
    const rightX = margin + tableWidth / 2;
    doc.setFont('Arial', 'bold');
    doc.rect(rightX, yPosition, labelWidth, rowHeight);
    doc.text(rightLabel, rightX + 2, yPosition + 5);
    
    const rightContentX = rightX + labelWidth;
    doc.rect(rightContentX, yPosition, leftContentWidth, rowHeight);
    if (rightContent) {
      doc.setFont('Arial', 'normal');
      const splitRightContent = doc.splitTextToSize(rightContent, leftContentWidth - 4);
      doc.text(splitRightContent, rightContentX + 2, yPosition + 5);
    }
    
    yPosition += rowHeight;
  };

  const setupFooterOnAllPages = () => {
    // Store the original addPage function
    const originalAddPage = doc.addPage;
    
    // Function to add footer to current page
    const addFooterToCurrentPage = () => {
      const footerY = doc.internal.pageSize.getHeight() - 30;
      doc.setFont('Arial', 'normal');
      doc.setFontSize(8);
      
      doc.setDrawColor(128, 0, 128);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY - 10, margin + tableWidth, footerY - 10);
      doc.setDrawColor(0, 0, 0);
      
      doc.text('Laboratori i patologjise "Pathology"', pageWidth / 2, footerY, { align: 'center' });
      doc.text('Ulpiana, D-8 H3, Nr. 10 | 10 000 Prishtine, Kosove', pageWidth / 2, footerY + 5, { align: 'center' });
      doc.text('w: www.patologjia.com | @: info@patologjia.com', pageWidth / 2, footerY + 10, { align: 'center' });
      doc.text('T: +383 (0) 45 250 475', pageWidth / 2, footerY + 15, { align: 'center' });
    };
    
    // Override the addPage function to automatically add footer to each new page
    doc.addPage = function() {
      // Call the original addPage function first
      originalAddPage.call(this);
      // Add footer to the newly added page if logos are included
      if (includeLogoSignature) {
        addFooterToCurrentPage();
      }
    };
    
    // Add footer to the first page as well if logos are included
    if (includeLogoSignature) {
      addFooterToCurrentPage();
    }
  };

  // Function to add a section header
  const addSectionHeader = (text) => {
    doc.setFont('Arial', 'bold');
    doc.setFontSize(10);
    doc.rect(margin, yPosition, tableWidth, 8);
    doc.text(text, margin + 2, yPosition + 5);
    yPosition += 8;
  };

  // Function to add a checkbox item (for PapTest2)
  const addCheckboxItem = (text, isChecked, indentLevel = 0) => {
    doc.setFontSize(10);
    const indent = indentLevel * 5;
    const boxSize = 3;
    const rowHeight = 6;
    
    checkAndAddPage(rowHeight);
    
    // Draw checkbox
    doc.rect(margin + indent, yPosition + 1, boxSize, boxSize);
    
    // Fill checkbox if checked
    if (isChecked) {
      doc.setFillColor(0, 0, 0);
      doc.rect(margin + indent, yPosition + 1, boxSize, boxSize, 'F');
      doc.setFillColor(255, 255, 255);
    }
    
    // Add text
    doc.setFont(isChecked ? 'Arial' : 'Arial', isChecked ? 'bold' : 'normal');
    doc.text(text, margin + indent + boxSize + 2, yPosition + 4);
    
    yPosition += rowHeight;
  };

  const addPathologistSection = async () => {
    // Calculate total height needed for pathologist section
    const pathologistSectionHeight = 80;
    
    // Check if we need a new page
    checkAndAddPage(pathologistSectionHeight);
    
    // Store the starting position for the entire section
    const sectionStartY = yPosition;
    
    // Add pathologist label and line consistently for both versions
    yPosition += 15;
    doc.setFont('Arial', 'bold');
    doc.setFontSize(10);
    doc.text('Patologu:', margin, yPosition);
    
    yPosition += 5;
    doc.setLineWidth(0.2);
    doc.line(margin, yPosition, margin + tableWidth, yPosition);
    
    if (includeLogoSignature) {
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
        doc.addImage(vulaImageData, 'PNG', margin, sectionStartY, 40, 40);

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
        doc.addImage(pathologyImageData, 'PNG', margin + tableWidth - 40, sectionStartY, 40, 40);
      } catch (error) {
        console.error('Error adding pathologist section images:', error);
      }
    }

    // Add doctor's name
    yPosition += 10;
    doc.setFont('Arial', 'normal');
    const doctorName = 'Prof. Ass. Dr. Labinot Shahini, MD, PhD';
    const textWidth = doc.getTextWidth(doctorName);
    const centerX = margin + (tableWidth / 2) - (textWidth / 2);
    doc.text(doctorName, centerX, yPosition);
    
    // Ensure consistent spacing after the section
    yPosition = sectionStartY + pathologistSectionHeight;
  };

// This function should replace the existing addPapTest2Content function in your code
// This function should replace the existing addPapTest2Content function in your code
const addPapTest2Content = (paptest2Data) => {
  if (!paptest2Data) {
    console.error('PapTest2 data is missing');
    return;
  }

  // Add title for PapTest2
  yPosition += 5; // Reduced spacing
  doc.setFont('Arial', 'bold');
  doc.setFontSize(12); // Smaller font size
  doc.setTextColor(128, 0, 128);
  doc.text('RAPORTI CITOLOGJIK', pageWidth / 2, yPosition, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPosition += 10; // Reduced spacing

  // Setup two-column layout
  const columnWidth = tableWidth / 2 - 5; // Subtract 5 for spacing between columns
  const leftColumnX = margin;
  const rightColumnX = margin + columnWidth + 10; // Add 10px spacing between columns
  
  // Track positions for each column independently
  let leftYPosition = yPosition;
  let rightYPosition = yPosition;
  
  // Left column content
  
  // I. LLOJI I MOSTRËS (left column)
  doc.setFont('Arial', 'bold');
  doc.setFontSize(9);
  doc.text('I. LLOJI I MOSTRËS', leftColumnX, leftYPosition);
  leftYPosition += 5;
  
  // Add checkbox items with smaller spacing
  const addColumnCheckbox = (x, y, text, isChecked, indentLevel = 0) => {
    doc.setFontSize(8);
    const indent = indentLevel * 3; // Smaller indent
    const boxSize = 2.5; // Smaller checkbox
    
    // Draw checkbox
    doc.rect(x + indent, y, boxSize, boxSize);
    
    // Fill checkbox if checked
    if (isChecked) {
      doc.setFillColor(0, 0, 0);
      doc.rect(x + indent, y, boxSize, boxSize, 'F');
      doc.setFillColor(255, 255, 255);
    }
    
    // Add text
    doc.setFont(isChecked ? 'Arial' : 'Arial', isChecked ? 'bold' : 'normal');
    doc.text(text, x + indent + boxSize + 1, y + 2);
    
    return y + 4; // Return updated Y position with smaller row height
  };
  
  leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Mostër konvencionale', paptest2Data.sampleType?.conventional);
  leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Tjetër ' + (paptest2Data.sampleType?.other || '______________________'), 
                paptest2Data.sampleType?.other && paptest2Data.sampleType.other.length > 0);
  
  // II. MOSTRA (left column)
  leftYPosition += 2;
  doc.setFont('Arial', 'bold');
  doc.setFontSize(9);
  doc.text('II. MOSTRA', leftColumnX, leftYPosition);
  leftYPosition += 5;
  
  leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'E kënaqshme për evaluim', paptest2Data.sampleQuality?.satisfactory);
  leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'E pakënaqshme ' + (paptest2Data.sampleQuality?.otherText || '_________________'), 
                paptest2Data.sampleQuality?.unsatisfactory);
  
  // III. REZULTATI (left column)
  leftYPosition += 2;
  doc.setFont('Arial', 'bold');
  doc.setFontSize(9);
  doc.text('III. REZULTATI', leftColumnX, leftYPosition);
  leftYPosition += 5;
  
  leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'NEGATIV PËR LESION INTRAEPITELIAL APO MALINJITET (NILM)', 
                paptest2Data.results?.negativeForLesion);
  
  // ABNORMALITETET E QELIZAVE EPITELIALE section
  leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'ABNORMALITETET E QELIZAVE EPITELIALE', !paptest2Data.results?.negativeForLesion);

  if (!paptest2Data.results?.negativeForLesion) {
    // Squamous cells
    leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Qelizat squamoze', 
                  paptest2Data.results?.epithelialAbnormalities?.squamousCell ? true : false, 1);

    if (paptest2Data.results?.epithelialAbnormalities?.squamousCell) {
      // Atypical cells
      leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Qeliza squamoze atipike', 
                    paptest2Data.results.epithelialAbnormalities.squamousCell.atypical, 2);
      
      if (paptest2Data.results.epithelialAbnormalities.squamousCell.atypical) {
        leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'me rëndësi të papërcaktuar (ASC–US)', 
                      paptest2Data.results.epithelialAbnormalities.squamousCell.ascUs, 3);
        leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'nuk mund të përjashtohet HSIL (ASC–H)', 
                      paptest2Data.results.epithelialAbnormalities.squamousCell.ascH, 3);
      }
      
      // Other squamous cell options
      leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Lezion intraepitelial squamoz i shkallës së ulët (LSIL)', 
                    paptest2Data.results.epithelialAbnormalities.squamousCell.lsil, 2);
      leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Lezion intraepitelial squamoz i shkallës së lartë (HSIL)', 
                    paptest2Data.results.epithelialAbnormalities.squamousCell.hsil, 2);
      leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Me tipare që japin dyshim për invazion', 
                    paptest2Data.results.epithelialAbnormalities.squamousCell.invasionSuspected, 2);
      leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Carcinoma squamocelulare', 
                    paptest2Data.results.epithelialAbnormalities.squamousCell.squamousCellCarcinoma, 2);
    }
    
    // Glandular cells
    leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Qelizat glandulare', 
                  paptest2Data.results?.epithelialAbnormalities?.glandular ? true : false, 1);
    
    if (paptest2Data.results?.epithelialAbnormalities?.glandular) {
      // Atypical glandular cells
      const hasAtypicalGlandular = 
        paptest2Data.results.epithelialAbnormalities.glandular.atypical?.endocervical || 
        paptest2Data.results.epithelialAbnormalities.glandular.atypical?.endometrial || 
        paptest2Data.results.epithelialAbnormalities.glandular.atypical?.glandular || 
        paptest2Data.results.epithelialAbnormalities.glandular.atypical?.neoplastic;
      
      leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Qeliza atipike', hasAtypicalGlandular, 2);
      
      if (hasAtypicalGlandular) {
        leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'endocervikale', 
                      paptest2Data.results.epithelialAbnormalities.glandular.atypical.endocervical, 3);
        leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'endometriale', 
                      paptest2Data.results.epithelialAbnormalities.glandular.atypical.endometrial, 3);
        leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'glandulare', 
                      paptest2Data.results.epithelialAbnormalities.glandular.atypical.glandular, 3);
        leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'glandulare, i përngjajnë qelizave neoplastike (AGC)', 
                      paptest2Data.results.epithelialAbnormalities.glandular.atypical.neoplastic, 3);
      }
      
      // More glandular cell options...if they fit in the left column
      // Otherwise, they can be moved to the right column
    }
  }
  
  // Right column content
  
  // IV. PËRSHKRIMI - Reactive changes (right column)
  doc.setFont('Arial', 'bold');
  doc.setFontSize(9);
  doc.text('IV. PËRSHKRIMI', rightColumnX, rightYPosition);
  rightYPosition += 5;
  
  doc.setFont('Arial', 'bold');
  doc.setFontSize(8);
  doc.text('Ndryshime reaktive qelizore të shoqëruara me:', rightColumnX, rightYPosition);
  rightYPosition += 4;
  
  // Check if any reactive changes exist
  const hasReactiveChanges = paptest2Data.results?.reactiveChanges;
  
  // Inflammation
  rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Inflamacion', 
                hasReactiveChanges && paptest2Data.results.reactiveChanges.inflammation, 1);
  
  if (hasReactiveChanges && paptest2Data.results.reactiveChanges.inflammation) {
    rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Uid', 
                  paptest2Data.results.reactiveChanges.inflammationDetails?.uid, 2);
    rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Ndryshime reparatore', 
                  paptest2Data.results.reactiveChanges.inflammationDetails?.repair, 2);
    rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Radiacion', 
                  paptest2Data.results.reactiveChanges.inflammationDetails?.radiation, 2);
    rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Qelizat cilindrike pas histerektomise', 
                  paptest2Data.results.reactiveChanges.inflammationDetails?.cylindricalCells, 2);
  }
  
  // Other reactive changes
  rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Metaplazion squamoz', 
                hasReactiveChanges && paptest2Data.results.reactiveChanges.squamousMetaplasia, 1);
  rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Atrofi', 
                hasReactiveChanges && paptest2Data.results.reactiveChanges.atrophy, 1);
  rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Ndryshime të lidhura me shtatzëni', 
                hasReactiveChanges && paptest2Data.results.reactiveChanges.pregnancyRelated, 1);
  rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Statusi citohormonal nuk i përgjigjet moshës', 
                hasReactiveChanges && paptest2Data.results.reactiveChanges.hormonal, 1);
  rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Qeliza endometriale (te femrat>=40 vjeç)', 
                hasReactiveChanges && paptest2Data.results.reactiveChanges.endometrialCells, 1);
  
  // V. UDHËZIME - Recommendations (right column)
  rightYPosition += 2;
  doc.setFont('Arial', 'bold');
  doc.setFontSize(9);
  doc.text('V. UDHËZIME', rightColumnX, rightYPosition);
  rightYPosition += 5;
  
  rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Të përsëritet analiza pas tretmanit', 
                paptest2Data.recommendations?.repeatAfterTreatment);
  
  // Repeat after period
  doc.setFont('Arial', 'normal');
  doc.setFontSize(8);
  doc.text('Të përsëritet analiza pas:', rightColumnX, rightYPosition);
  rightYPosition += 4;
  
  const months = paptest2Data.recommendations?.repeatAfter?.months || '';
  const years = paptest2Data.recommendations?.repeatAfter?.years || '';
  
  doc.setFont(months ? 'Arial' : 'Arial', months ? 'bold' : 'normal');
  doc.text(`${months} muajve /`, rightColumnX + 3, rightYPosition);
  doc.setFont(years ? 'Arial' : 'Arial', years ? 'bold' : 'normal');
  doc.text(`${years} viti`, rightColumnX + 30, rightYPosition);
  rightYPosition += 6;
  
  doc.setFont('Arial', 'normal');
  doc.text('Të bëhet:', rightColumnX, rightYPosition);
  rightYPosition += 4;
  
  // Tests to be done
  rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'HPV tipizimi', 
                paptest2Data.recommendations?.hpvTyping, 1);
  rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Kolposkopia', 
                paptest2Data.recommendations?.colposcopy, 1);
  rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Biopsia', 
                paptest2Data.recommendations?.biopsy, 1);
  
  // Comments section
  if (paptest2Data.comments) {
    rightYPosition += 2;
    doc.setFont('Arial', 'bold');
    doc.setFontSize(8);
    doc.text('Komenti:', rightColumnX, rightYPosition);
    rightYPosition += 4;
    
    doc.setFont('Arial', 'normal');
    const comments = doc.splitTextToSize(paptest2Data.comments, columnWidth);
    doc.text(comments, rightColumnX, rightYPosition);
    rightYPosition += comments.length * 4;
  }
  
  // Update the main yPosition to the maximum of the two columns
  yPosition = Math.max(leftYPosition, rightYPosition);
};
  // Helper function to format referring doctors
  const formatReferringDoctors = (mainDoctor, additionalDoctorsJSON) => {
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
  };

  // Format institution with address
  const formatInstitutionWithAddress = (institution, address) => {
    if (!institution) return "";
    if (!address) return institution;
    return `${institution}${address ? ', ' + address : ''}`;
  };

  try {
    // Add header logo if needed
    if (includeLogoSignature) {
      const logoWidth = 40;
      const logoX = (pageWidth - logoWidth) / 2;
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
      
      doc.addImage(imageData, 'PNG', logoX, 20, logoWidth, 20);
    }

    // Patient Information Table
    
    // First row: Healthcare Institution and Institution Address
    addSplitRow(
      'Institucioni Shendetesor',
      report.healthcareInstitution || '',
      'Adresa e Institucionit',
      report.institutionAddress || ''
    );

    // Second row: Patient name and Reference
    addSplitRow(
      'Emri',
      `${report.patientId.firstName} ${report.patientId.lastName}`,
      'Referenca',
      report.referenceNumber
    );

    addSplitRow(
      'Datelindja',
      new Date(report.patientId.dateOfBirth).toLocaleDateString(),
      'Perfunduar me',
      report.finishedAt ? new Date(report.finishedAt).toLocaleDateString() : ''
    );

    addSplitRow(
      'Gjinia',
      report.patientId.gender,
      'Adresa',
      report.patientId.address
    );

    // Format referring doctors (both primary and additional)
    const allReferringDoctors = formatReferringDoctors(
      report.referringDoctor,
      report.referringDoctors
    );

    addRow(
      'Mjeku Referues',
      allReferringDoctors,
      true
    );

    addRow(
      'Diagnoza Klinike',
      report.diagnosis,
      true
    );

    // Report Content based on report type
    if (report.reportType === 'PapTest2') {
      // Handle PapTest2 specific content
      addPapTest2Content(report.paptest2Data);
    }else if (report.reportType === 'Biopsy') {
      // Title for Biopsy
      yPosition += 10;
      doc.setFont('Arial', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(128, 0, 128);
      doc.text('RAPORTI PATOLOGJIK', pageWidth / 2, yPosition, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      
      // Add purple line below title
      yPosition += 5;
      doc.setDrawColor(128, 0, 128);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, margin + tableWidth, yPosition);
      doc.setDrawColor(0, 0, 0);
      
      yPosition += 3; // Space after line

       // Add purple line after diagnosis
       yPosition += 5;
       doc.setDrawColor(128, 0, 128);
       doc.setLineWidth(0.5);
       doc.line(margin, yPosition, margin + tableWidth, yPosition);
       doc.setDrawColor(0, 0, 0);
       
       yPosition += 5; // Space after line
      
      // Add diagnosis section
      addRow('Diagnoza histopatologjike: ', report.histopathologicalDiagnosis, true);
      
      // Add purple line after diagnosis
      yPosition += 5;
      doc.setDrawColor(128, 0, 128);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, margin + tableWidth, yPosition);
      doc.setDrawColor(0, 0, 0);
      
      yPosition += 5; // Space after line
      
      // Add microscopic examination with increased spacing
      addRow('Ekzaminimi mikroskopik: ', report.microscopicExamination, true);
      yPosition += 5; // Extra space
      
      // Add macroscopic examination with increased spacing
      addRow('Ekzaminimi makroskopik: ', report.macroscopicExamination, true);
      yPosition += 5; // Extra space
      
      // Add sample
    
    }  else {
      // Title for PapTest or Cytology
      yPosition += 10;
      doc.setFont('Arial', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(128, 0, 128);
      doc.text('RAPORTI CITOLOGJIK', pageWidth / 2, yPosition, { align: 'center' });
      doc.setTextColor(0, 0, 0);
      
      // Add purple line below title
      yPosition += 5;
      doc.setDrawColor(128, 0, 128);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, margin + tableWidth, yPosition);
      doc.setDrawColor(0, 0, 0);
      
      yPosition += 10; // Space after line
    
      // Add cytological examination
      addRow('Ekzaminimi citologjik: ', report.cytologicalExamination, true);
      
      // Add extra space between examination and sample
      yPosition += 7;
    }

    // Add sample for non-PapTest2 reports
    if (report.reportType !== 'PapTest2') {
      addRow('Mostra: ', report.sample, true);
    }

    // Add Pathologist section
    await addPathologistSection();

    // Footer
    if (includeLogoSignature) {
      const footerY = doc.internal.pageSize.getHeight() - 30;
      doc.setFont('Arial', 'normal');
      doc.setFontSize(8);
      
      doc.setDrawColor(128, 0, 128);
      doc.setLineWidth(0.5);
      doc.line(margin, footerY - 10, margin + tableWidth, footerY - 10);
      doc.setDrawColor(0, 0, 0);
      
      doc.text('Laboratori i patologjise "Pathology"', pageWidth / 2, footerY, { align: 'center' });
      doc.text('Ulpiana, D-8 H3, Nr. 10 | 10 000 Prishtine, Kosove', pageWidth / 2, footerY + 5, { align: 'center' });
      doc.text('w: www.patologjia.com | @: info@patologjia.com', pageWidth / 2, footerY + 10, { align: 'center' });
      doc.text('T: +383 (0) 45 250 475', pageWidth / 2, footerY + 15, { align: 'center' });
    }
    
    return doc;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
    return null;
  }
};

const PDFReportGenerator = ({ report, previewMode = false, previewType = 'electronic', onPreviewReady, onClose }) => {
  const pdfCanvasRef = useRef(null);
  const [pdfBlob, setPdfBlob] = useState(null);

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

          // Generate the PDF
          const includeLogos = previewType === 'electronic';
          const doc = await createPDFDoc(report, includeLogos);
          
          if (!doc) {
            console.error('PDF document creation failed');
            if (onPreviewReady) onPreviewReady();
            return;
          }
          
          // Create a loading indicator
          const loadingDiv = document.createElement('div');
          loadingDiv.className = 'text-center my-8';
          loadingDiv.innerHTML = '<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div><p class="mt-2 text-gray-500">Loading PDF preview...</p>';
          pdfCanvasRef.current.appendChild(loadingDiv);
          
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

    // Create a temporary anchor element to download the PDF
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${report.patientId.lastName}-${report.reportType}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(pdfUrl);

    // Open the default email client with the PDF attached
    const subject = `Report for ${report.patientId.firstName} ${report.patientId.lastName}`;
    const body = 'Please find the attached report.';
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&attachment=${encodeURIComponent(pdfUrl)}`;

    window.location.href = mailtoLink;
  };

  if (previewMode) {
    return (
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