// components/ViewReport/PapTest2Card.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const PapTest2Card = ({ reportType, paptest2Data }) => {
  // Ensure paptest2Data has the correct structure with fallbacks
  const safeData = paptest2Data || {
    sampleType: { conventional: false, other: '' },
    sampleQuality: { satisfactory: false, unsatisfactory: false, otherText: '' },
    results: {
      negativeForLesion: false,
      epithelialAbnormalities: {
        squamousCell: null,
        glandular: null
      },
      reactiveChanges: null
    },
    recommendations: {
      repeatAfterTreatment: false,
      repeatAfter: { months: null, years: null },
      hpvTyping: false,
      colposcopy: false,
      biopsy: false
    },
    comments: ''
  };

  return (
    <Card className="mt-6 lg:col-span-2">
      <CardHeader>
        <CardTitle>Pap Test 2 Details</CardTitle>
        <CardDescription>Detailed results of the Pap Test 2</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Sample Type Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">I. LLOJI I MOSTRËS</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={safeData.sampleType?.conventional ? "font-bold" : "text-gray-600"}>
                  Mostër konvencionale
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={safeData.sampleType?.other ? "font-bold" : "text-gray-600"}>
                  Tjetër
                </span>
              </div>
              {safeData.sampleType?.other && (
                <p className="ml-6 font-bold">{safeData.sampleType.other}</p>
              )}
            </div>
          </div>

          {/* Sample Quality Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">II. MOSTRA</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={safeData.sampleQuality?.satisfactory ? "font-bold" : "text-gray-600"}>
                  E kënaqshme për evaluim
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={safeData.sampleQuality?.unsatisfactory ? "font-bold" : "text-gray-600"}>
                  E pakënaqshme
                </span>
              </div>
              {safeData.sampleQuality?.unsatisfactory && safeData.sampleQuality?.otherText && (
                <p className="ml-6 font-bold">{safeData.sampleQuality.otherText}</p>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">III. REZULTATI</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className={safeData.results?.negativeForLesion ? "font-bold" : "text-gray-600"}>
                  NEGATIV PËR LESION INTRAEPITELIAL APO MALINJITET (NILM)
                </span>
              </div>

              <div className="flex items-start">
                <span className={!safeData.results?.negativeForLesion ? "font-bold" : "text-gray-600"}>
                  ABNORMALITETET E QELIZAVE EPITELIALE
                </span>
              </div>

              {/* Epithelial Abnormalities */}
              <div className="ml-6 space-y-4">
                {/* Squamous Cells Section */}
                <SquamousCellsSection squamousCell={safeData.results.epithelialAbnormalities?.squamousCell} />
                
                {/* Glandular Cells Section */}
                <GlandularCellsSection glandular={safeData.results.epithelialAbnormalities?.glandular} />
              </div>
            </div>
          </div>

          {/* Reactive Changes Section */}
          <ReactiveChangesSection reactiveChanges={safeData.results?.reactiveChanges} />

          {/* Recommendations Section */}
          <RecommendationsSection recommendations={safeData.recommendations} />

          {/* Comments Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Komenti</label>
            <p className={safeData.comments ? "font-bold" : "text-gray-600"}>
              {safeData.comments || "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Squamous Cells Subsection Component
const SquamousCellsSection = ({ squamousCell }) => {
  if (!squamousCell) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="font-bold">Qelizat squamoze</span>
      </div>

      {/* Squamous Cell Details */}
      <div className="ml-6 space-y-2">
        {/* Atypical Cells */}
        {squamousCell.atypical && (
          <>
            <div className="flex items-center">
              <span className="font-bold">Qeliza squamoze atipike</span>
            </div>

            {/* Atypical Cell Types */}
            <div className="ml-6 space-y-2">
              <div className="flex items-center">
                <span className={squamousCell.ascUs ? "font-bold" : "text-gray-600"}>
                  me rëndësi të papërcaktuar (ASC–US)
                </span>
              </div>
              <div className="flex items-center">
                <span className={squamousCell.ascH ? "font-bold" : "text-gray-600"}>
                  nuk mund të përjashtohet HSIL (ASC–H)
                </span>
              </div>
            </div>
          </>
        )}

        {/* Other Squamous Cell Options */}
        <div className="space-y-2">
          <div className="flex items-center">
            <span className={squamousCell.lsil ? "font-bold" : "text-gray-600"}>
              Lezion intraepitelial squamoz i shkallës së ulët (LSIL)
            </span>
          </div>
          <div className="flex items-center">
            <span className={squamousCell.hsil ? "font-bold" : "text-gray-600"}>
              Lezion intraepitelial squamoz i shkallës së lartë (HSIL)
            </span>
          </div>
          <div className="flex items-center">
            <span className={squamousCell.invasionSuspected ? "font-bold" : "text-gray-600"}>
              Me tipare që japin dyshim për invazion
            </span>
          </div>
          <div className="flex items-center">
            <span className={squamousCell.squamousCellCarcinoma ? "font-bold" : "text-gray-600"}>
              Carcinoma squamocelulare
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Glandular Cells Subsection Component
const GlandularCellsSection = ({ glandular }) => {
  if (!glandular) return null;

  // Check if any atypical options are selected
  const hasAtypical = 
    glandular.atypical?.endocervical || 
    glandular.atypical?.endometrial || 
    glandular.atypical?.glandular || 
    glandular.atypical?.neoplastic;
    
  // Check if any adenocarcinoma options are selected
  const hasAdenocarcinoma =
    glandular.adenocarcinoma?.endocervical ||
    glandular.adenocarcinoma?.endometrial;

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="font-bold">Qelizat glandulare</span>
      </div>

      {/* Glandular Cell Details */}
      <div className="ml-6 space-y-2">
        {/* Atypical */}
        {hasAtypical && (
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-bold">Qeliza atipike</span>
            </div>

            {/* Atypical Types */}
            <div className="ml-6 space-y-2">
              <div className="flex items-center">
                <span className={glandular.atypical?.endocervical ? "font-bold" : "text-gray-600"}>
                  endocervikale
                </span>
              </div>
              <div className="flex items-center">
                <span className={glandular.atypical?.endometrial ? "font-bold" : "text-gray-600"}>
                  endometriale
                </span>
              </div>
              <div className="flex items-center">
                <span className={glandular.atypical?.glandular ? "font-bold" : "text-gray-600"}>
                  glandulare
                </span>
              </div>
              <div className="flex items-center">
                <span className={glandular.atypical?.neoplastic ? "font-bold" : "text-gray-600"}>
                  glandulare, i përngjajnë qelizave neoplastike (AGC)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Adenocarcinoma in Situ */}
        <div className="flex items-center">
          <span className={glandular.endocervicalAdenocarcinomaInSitu ? "font-bold" : "text-gray-600"}>
            Adenocarcinoma endocervikale in situ
          </span>
        </div>

        {/* Adenocarcinoma */}
        {hasAdenocarcinoma && (
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="font-bold">Adenocarcinoma</span>
            </div>

            {/* Adenocarcinoma Types */}
            <div className="ml-6 space-y-2">
              <div className="flex items-center">
                <span className={glandular.adenocarcinoma?.endocervical ? "font-bold" : "text-gray-600"}>
                  endocervikale
                </span>
              </div>
              <div className="flex items-center">
                <span className={glandular.adenocarcinoma?.endometrial ? "font-bold" : "text-gray-600"}>
                  endometriale
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Other Malignancy */}
        {glandular.otherMalignancy && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tjetër neoplazi malinje:
            </label>
            <p className="font-bold">{glandular.otherMalignancy}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reactive Changes Subsection Component
const ReactiveChangesSection = ({ reactiveChanges }) => {
  if (!reactiveChanges) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">IV. PËRSHKRIMI</h3>
      
      {/* Ndryshime reaktive qelizore */}
      <div className="space-y-2">
        <h4 className="font-medium">Ndryshime reaktive qelizore të shoqëruara me:</h4>
        <div className="ml-4 space-y-3">
          {/* Inflammation with subcategories */}
          {reactiveChanges.inflammation && (
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-bold">
                  <strong>Inflamacion</strong>
                </span>
              </div>
              
              {/* Inflammation subtypes */}
              <div className="ml-6 space-y-2">
                <div className="flex items-center">
                  <span className={reactiveChanges.inflammationDetails?.uid ? "font-bold" : "text-gray-600"}>
                    Uid
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={reactiveChanges.inflammationDetails?.repair ? "font-bold" : "text-gray-600"}>
                    Ndryshime reparatore
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={reactiveChanges.inflammationDetails?.radiation ? "font-bold" : "text-gray-600"}>
                    Radiacion
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={reactiveChanges.inflammationDetails?.cylindricalCells ? "font-bold" : "text-gray-600"}>
                    Qeliza cilindrike pas histerektomise
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Other reactive changes */}
          <div className="flex items-center">
            <span className={reactiveChanges.squamousMetaplasia ? "font-bold" : "text-gray-600"}>
              Metaplazion squamoz
            </span>
          </div>
          <div className="flex items-center">
            <span className={reactiveChanges.atrophy ? "font-bold" : "text-gray-600"}>
              Atrofi
            </span>
          </div>
          <div className="flex items-center">
            <span className={reactiveChanges.pregnancyRelated ? "font-bold" : "text-gray-600"}>
              Ndryshime të lidhura me shtatzëni
            </span>
          </div>
          <div className="flex items-center">
            <span className={reactiveChanges.hormonal ? "font-bold" : "text-gray-600"}>
              Statusi citohormonal nuk i përgjigjet moshës
            </span>
          </div>
          <div className="flex items-center">
            <span className={reactiveChanges.endometrialCells ? "font-bold" : "text-gray-600"}>
              Qeliza endometriale (te femrat>=40 vjeç)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recommendations Subsection Component
const RecommendationsSection = ({ recommendations }) => {
  if (!recommendations) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">V. UDHËZIME</h3>
      <div className="space-y-4">
        <div className="flex items-center">
          <span className={recommendations.repeatAfterTreatment ? "font-bold" : "text-gray-600"}>
            Të përsëritet analiza pas tretmanit
          </span>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Të përsëritet analiza pas:</label>
          <div className="flex items-center space-x-2">
            <span className={recommendations.repeatAfter?.months ? "font-bold" : "text-gray-600"}>
              {recommendations.repeatAfter?.months || "0"} muajve /
            </span>
            <span className={recommendations.repeatAfter?.years ? "font-bold" : "text-gray-600"}>
              {recommendations.repeatAfter?.years || "0"} viti
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Të bëhet:</label>
          <div className="space-y-2 ml-4">
            <div className="flex items-center">
              <span className={recommendations.hpvTyping ? "font-bold" : "text-gray-600"}>
                HPV tipizimi
              </span>
            </div>
            <div className="flex items-center">
              <span className={recommendations.colposcopy ? "font-bold" : "text-gray-600"}>
                Kolposkopia
              </span>
            </div>
            <div className="flex items-center">
              <span className={recommendations.biopsy ? "font-bold" : "text-gray-600"}>
                Biopsia
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PapTest2Card;