// utils/pdfGenerators/PapTest2Generator.js
import BasePdfGenerator from './BasePdfGenerator';

class PapTest2Generator extends BasePdfGenerator {
  constructor(report, includeLogoSignature = true) {
    super(report, includeLogoSignature);
  }

  async generatePDF() {
    // Add title for PapTest2
    this.yPosition += 5;
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(128, 0, 128);
    this.doc.text('RAPORTI CITOLOGJIK', this.pageWidth / 2, this.yPosition, { align: 'center' });
    this.doc.setTextColor(0, 0, 0);
    this.yPosition += 10;

    // Get paptest2 data
    const paptest2Data = this.report.paptest2Data;
    if (!paptest2Data) {
      console.error('PapTest2 data is missing');
      return;
    }

    // Setup two-column layout
    const columnWidth = this.tableWidth / 2 - 5;
    const leftColumnX = this.margin;
    const rightColumnX = this.margin + columnWidth + 10;
    
    // Track positions for each column independently
    let leftYPosition = this.yPosition;
    let rightYPosition = this.yPosition;
    
    // Helper function for adding column checkboxes
    const addColumnCheckbox = (x, y, text, isChecked, indentLevel = 0) => {
      this.doc.setFontSize(8);
      const indent = indentLevel * 3;
      const boxSize = 2.5;
      
      // Draw checkbox
      this.doc.rect(x + indent, y, boxSize, boxSize);
      
      // Fill checkbox if checked
      if (isChecked) {
        this.doc.setFillColor(0, 0, 0);
        this.doc.rect(x + indent, y, boxSize, boxSize, 'F');
        this.doc.setFillColor(255, 255, 255);
      }
      
      // Add text
      this.doc.setFont(isChecked ? 'Arial' : 'Arial', isChecked ? 'bold' : 'normal');
      this.doc.text(text, x + indent + boxSize + 1, y + 2);
      
      return y + 4;
    };

    // LEFT COLUMN CONTENT
    
    // I. LLOJI I MOSTRËS (left column)
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(9);
    this.doc.text('I. LLOJI I MOSTRËS', leftColumnX, leftYPosition);
    leftYPosition += 5;
    
    leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Mostër konvencionale', paptest2Data.sampleType?.conventional);
    leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'Tjetër ' + (paptest2Data.sampleType?.other || '______________________'), 
                  paptest2Data.sampleType?.other && paptest2Data.sampleType.other.length > 0);
    
    // II. MOSTRA (left column)
    leftYPosition += 2;
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(9);
    this.doc.text('II. MOSTRA', leftColumnX, leftYPosition);
    leftYPosition += 5;
    
    leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'E kënaqshme për evaluim', paptest2Data.sampleQuality?.satisfactory);
    leftYPosition = addColumnCheckbox(leftColumnX, leftYPosition, 'E pakënaqshme ' + (paptest2Data.sampleQuality?.otherText || '_________________'), 
                  paptest2Data.sampleQuality?.unsatisfactory);
    
    // III. REZULTATI (left column)
    leftYPosition += 2;
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(9);
    this.doc.text('III. REZULTATI', leftColumnX, leftYPosition);
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
      }
    }
    
    // RIGHT COLUMN CONTENT
    
    // IV. PËRSHKRIMI - Reactive changes (right column)
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(9);
    this.doc.text('IV. PËRSHKRIMI', rightColumnX, rightYPosition);
    rightYPosition += 5;
    
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(8);
    this.doc.text('Ndryshime reaktive qelizore të shoqëruara me:', rightColumnX, rightYPosition);
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
    this.doc.setFont('Arial', 'bold');
    this.doc.setFontSize(9);
    this.doc.text('V. UDHËZIME', rightColumnX, rightYPosition);
    rightYPosition += 5;
    
    rightYPosition = addColumnCheckbox(rightColumnX, rightYPosition, 'Të përsëritet analiza pas tretmanit', 
                  paptest2Data.recommendations?.repeatAfterTreatment);
    
    // Repeat after period
    this.doc.setFont('Arial', 'normal');
    this.doc.setFontSize(8);
    this.doc.text('Të përsëritet analiza pas:', rightColumnX, rightYPosition);
    rightYPosition += 4;
    
    const months = paptest2Data.recommendations?.repeatAfter?.months || '';
    const years = paptest2Data.recommendations?.repeatAfter?.years || '';
    
    this.doc.setFont(months ? 'Arial' : 'Arial', months ? 'bold' : 'normal');
    this.doc.text(`${months} muajve /`, rightColumnX + 3, rightYPosition);
    this.doc.setFont(years ? 'Arial' : 'Arial', years ? 'bold' : 'normal');
    this.doc.text(`${years} viti`, rightColumnX + 30, rightYPosition);
    rightYPosition += 6;
    
    this.doc.setFont('Arial', 'normal');
    this.doc.text('Të bëhet:', rightColumnX, rightYPosition);
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
      this.doc.setFont('Arial', 'bold');
      this.doc.setFontSize(8);
      this.doc.text('Komenti:', rightColumnX, rightYPosition);
      rightYPosition += 4;
      
      this.doc.setFont('Arial', 'normal');
      const comments = this.doc.splitTextToSize(paptest2Data.comments, columnWidth);
      this.doc.text(comments, rightColumnX, rightYPosition);
      rightYPosition += comments.length * 4;
    }
    
    // Update the main yPosition to the maximum of the two columns
    this.yPosition = Math.max(leftYPosition, rightYPosition);
  }
}

export default PapTest2Generator;