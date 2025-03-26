// components/ReportForm/PapTest2Form.js
import React from 'react';

const PapTest2Form = ({ formData, handlePapTest2Change, readOnly }) => {
  // Ensure all nested objects have default values if undefined
  const paptest2Data = formData.paptest2Data || {
    sampleType: {
      selected: 'conventional',
      otherText: '',
    },
    sampleQuality: {
      selected: 'satisfactory',
      otherText: '',
    },
    results: {
      selected: 'nilm',
      epithelialAbnormalities: {
        squamousCells: {
          selected: false,
          atypicalCells: {
            selected: false,
            type: 'asc-us',
          },
          lsil: false,
          hsil: false,
          invasionSuspected: false,
          carcinoma: false,
        },
        glandularCells: {
          selected: false,
          atypical: {
            selected: false,
            endocervical: false,
            endometrial: false,
            glandular: false,
            neoplastic: false,
          },
          adenocarcinomaInSitu: false,
          adenocarcinoma: {
            selected: false,
            endocervical: false,
            endometrial: false,
          },
          otherMalignancy: '',
        },
      },
      reactiveChanges: {
        selected: false,
        inflammation: {
          selected: false,
          uid: false,
          repair: false,
          radiation: false,
          cylindricalCells: false,
        },
        squamousMetaplasia: false,
        atrophy: false,
        pregnancyRelated: false,
        hormonalStatus: false,
        endometrialCells: false,
      },
    },
    recommendations: {
      repeatAfterTreatment: false,
      repeatAfterPeriod: {
        months: '',
        years: '',
      },
      hpvTyping: false,
      colposcopy: false,
      biopsy: false,
    },
    comments: '',
  };

  // Make sure we have valid results structure
  if (!paptest2Data.results) {
    paptest2Data.results = {
      selected: 'nilm',
      epithelialAbnormalities: {
        squamousCells: {
          selected: false,
          atypicalCells: {
            selected: false,
            type: 'asc-us',
          },
          lsil: false,
          hsil: false,
          invasionSuspected: false,
          carcinoma: false,
        },
        glandularCells: {
          selected: false,
          atypical: {
            selected: false,
            endocervical: false,
            endometrial: false,
            glandular: false,
            neoplastic: false,
          },
          adenocarcinomaInSitu: false,
          adenocarcinoma: {
            selected: false,
            endocervical: false,
            endometrial: false,
          },
          otherMalignancy: '',
        },
      },
      reactiveChanges: {
        selected: false,
        inflammation: {
          selected: false,
          uid: false,
          repair: false,
          radiation: false,
          cylindricalCells: false,
        },
        squamousMetaplasia: false,
        atrophy: false,
        pregnancyRelated: false,
        hormonalStatus: false,
        endometrialCells: false,
      },
    };
  }

  // Ensure reactiveChanges exists
  if (!paptest2Data.results.reactiveChanges) {
    paptest2Data.results.reactiveChanges = {
      selected: false,
      inflammation: {
        selected: false,
        uid: false,
        repair: false,
        radiation: false,
        cylindricalCells: false,
      },
      squamousMetaplasia: false,
      atrophy: false,
      pregnancyRelated: false,
      hormonalStatus: false,
      endometrialCells: false,
    };
  }

  // Ensure inflammation exists
  if (!paptest2Data.results.reactiveChanges.inflammation) {
    paptest2Data.results.reactiveChanges.inflammation = {
      selected: false,
      uid: false,
      repair: false,
      radiation: false,
      cylindricalCells: false,
    };
  }

  // Destructure for easier access
  const {
    sampleType,
    sampleQuality,
    results,
    recommendations,
    comments,
  } = paptest2Data;

  const handleChange = (section, value) => {
    if (!readOnly) {
      handlePapTest2Change(section, value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sample Type Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">I. LLOJI I MOSTRËS <span className="text-red-500">*</span></h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="conventional"
              name="sampleType"
              checked={sampleType.selected === 'conventional'}
              onChange={() => handleChange('sampleType', { selected: 'conventional', otherText: '' })}
              className="border-gray-300 text-indigo-600"
              disabled={readOnly}
            />
            <label htmlFor="conventional">Mostër konvencionale</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="other"
              name="sampleType"
              checked={sampleType.selected === 'other'}
              onChange={() => handleChange('sampleType', { selected: 'other', otherText: sampleType.otherText })}
              className="border-gray-300 text-indigo-600"
              disabled={readOnly}
            />
            <label htmlFor="other">Tjetër</label>
          </div>
          {sampleType.selected === 'other' && (
            <input
              type="text"
              value={sampleType.otherText}
              onChange={(e) => handleChange('sampleType', { selected: 'other', otherText: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Specifiko llojin e mostrës..."
              disabled={readOnly}
            />
          )}
        </div>
      </div>

      {/* Sample Quality Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">II. MOSTRA <span className="text-red-500">*</span></h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="satisfactory"
              name="sampleQuality"
              checked={sampleQuality.selected === 'satisfactory'}
              onChange={() => handleChange('sampleQuality', { selected: 'satisfactory', otherText: '' })}
              className="border-gray-300 text-indigo-600"
              disabled={readOnly}
            />
            <label htmlFor="satisfactory">E kënaqshme për evaluim</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="unsatisfactory"
              name="sampleQuality"
              checked={sampleQuality.selected === 'unsatisfactory'}
              onChange={() => handleChange('sampleQuality', { selected: 'unsatisfactory', otherText: sampleQuality.otherText })}
              className="border-gray-300 text-indigo-600"
              disabled={readOnly}
            />
            <label htmlFor="unsatisfactory">E pakënaqshme</label>
          </div>
          {sampleQuality.selected === 'unsatisfactory' && (
            <input
              type="text"
              value={sampleQuality.otherText}
              onChange={(e) => handleChange('sampleQuality', { selected: 'unsatisfactory', otherText: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Specifiko arsyen..."
              disabled={readOnly}
            />
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">III. REZULTATI <span className="text-red-500">*</span></h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="nilm"
              name="results"
              checked={results.selected === 'nilm'}
              onChange={() => handleChange('results', { ...results, selected: 'nilm' })}
              className="border-gray-300 text-indigo-600"
              disabled={readOnly}
            />
            <label htmlFor="nilm">NEGATIV PËR LESION INTRAEPITELIAL APO MALINJITET (NILM)</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="abnormalities"
              name="results"
              checked={results.selected === 'abnormalities'}
              onChange={() => handleChange('results', { ...results, selected: 'abnormalities' })}
              className="border-gray-300 text-indigo-600"
              disabled={readOnly}
            />
            <label htmlFor="abnormalities">ABNORMALITETET E QELIZAVE EPITELIALE</label>
          </div>

          {/* Epithelial Abnormalities Section */}
          {results.selected === 'abnormalities' && (
            <div className="ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
              {/* Squamous Cells Section */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="squamousCells"
                  checked={results.epithelialAbnormalities?.squamousCells?.selected || false}
                  onChange={(e) =>
                    handleChange('results', {
                      ...results,
                      epithelialAbnormalities: {
                        ...results.epithelialAbnormalities,
                        squamousCells: {
                          ...(results.epithelialAbnormalities?.squamousCells || {}),
                          selected: e.target.checked,
                        },
                      },
                    })
                  }
                  className="rounded border-gray-300 text-indigo-600"
                  disabled={readOnly}
                />
                <label htmlFor="squamousCells" className="font-medium">Qelizat squamoze</label>
              </div>

              {results.epithelialAbnormalities?.squamousCells?.selected && (
                <div className="ml-6 space-y-3 border-l-2 border-gray-100 pl-4">
                  {/* Atypical Cells */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="atypicalCells"
                      checked={results.epithelialAbnormalities?.squamousCells?.atypicalCells?.selected || false}
                      onChange={(e) =>
                        handleChange('results', {
                          ...results,
                          epithelialAbnormalities: {
                            ...results.epithelialAbnormalities,
                            squamousCells: {
                              ...results.epithelialAbnormalities.squamousCells,
                              atypicalCells: {
                                ...(results.epithelialAbnormalities?.squamousCells?.atypicalCells || {}),
                                selected: e.target.checked,
                              },
                            },
                          },
                        })
                      }
                      className="rounded border-gray-300 text-indigo-600"
                      disabled={readOnly}
                    />
                    <label htmlFor="atypicalCells">Qeliza squamoze atipike</label>
                  </div>

                  {/* Atypical Cell Types */}
                  {results.epithelialAbnormalities?.squamousCells?.atypicalCells?.selected && (
                    <div className="ml-6 space-y-2 border-l-2 border-gray-100 pl-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="asc-us"
                          name="atypicalType"
                          checked={(results.epithelialAbnormalities?.squamousCells?.atypicalCells?.type || '') === 'asc-us'}
                          onChange={() =>
                            handleChange('results', {
                              ...results,
                              epithelialAbnormalities: {
                                ...results.epithelialAbnormalities,
                                squamousCells: {
                                  ...results.epithelialAbnormalities.squamousCells,
                                  atypicalCells: {
                                    ...results.epithelialAbnormalities.squamousCells.atypicalCells,
                                    type: 'asc-us',
                                  },
                                },
                              },
                            })
                          }
                          className="border-gray-300 text-indigo-600"
                          disabled={readOnly}
                        />
                        <label htmlFor="asc-us">me rëndësi të papërcaktuar (ASC–US)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="asc-h"
                          name="atypicalType"
                          checked={(results.epithelialAbnormalities?.squamousCells?.atypicalCells?.type || '') === 'asc-h'}
                          onChange={() =>
                            handleChange('results', {
                              ...results,
                              epithelialAbnormalities: {
                                ...results.epithelialAbnormalities,
                                squamousCells: {
                                  ...results.epithelialAbnormalities.squamousCells,
                                  atypicalCells: {
                                    ...results.epithelialAbnormalities.squamousCells.atypicalCells,
                                    type: 'asc-h',
                                  },
                                },
                              },
                            })
                          }
                          className="border-gray-300 text-indigo-600"
                          disabled={readOnly}
                        />
                        <label htmlFor="asc-h">nuk mund të përjashtohet HSIL (ASC –H)</label>
                      </div>
                    </div>
                  )}

                  {/* Other Squamous Cell Options */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lsil"
                        checked={results.epithelialAbnormalities?.squamousCells?.lsil || false}
                        onChange={(e) =>
                          handleChange('results', {
                            ...results,
                            epithelialAbnormalities: {
                              ...results.epithelialAbnormalities,
                              squamousCells: {
                                ...results.epithelialAbnormalities.squamousCells,
                                lsil: e.target.checked,
                              },
                            },
                          })
                        }
                        className="rounded border-gray-300 text-indigo-600"
                        disabled={readOnly}
                      />
                      <label htmlFor="lsil">Lezion intraepitelial squamoz i shkallës së ulët (LSIL)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hsil"
                        checked={results.epithelialAbnormalities?.squamousCells?.hsil || false}
                        onChange={(e) =>
                          handleChange('results', {
                            ...results,
                            epithelialAbnormalities: {
                              ...results.epithelialAbnormalities,
                              squamousCells: {
                                ...results.epithelialAbnormalities.squamousCells,
                                hsil: e.target.checked,
                              },
                            },
                          })
                        }
                        className="rounded border-gray-300 text-indigo-600"
                        disabled={readOnly}
                      />
                      <label htmlFor="hsil">Lezion intraepitelial squamoz i shkallës së lartë (HSIL)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="invasionSuspected"
                        checked={results.epithelialAbnormalities?.squamousCells?.invasionSuspected || false}
                        onChange={(e) =>
                          handleChange('results', {
                            ...results,
                            epithelialAbnormalities: {
                              ...results.epithelialAbnormalities,
                              squamousCells: {
                                ...results.epithelialAbnormalities.squamousCells,
                                invasionSuspected: e.target.checked,
                              },
                            },
                          })
                        }
                        className="rounded border-gray-300 text-indigo-600"
                        disabled={readOnly}
                      />
                      <label htmlFor="invasionSuspected">Me tipare që japin dyshim për invazion</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="carcinoma"
                        checked={results.epithelialAbnormalities?.squamousCells?.carcinoma || false}
                        onChange={(e) =>
                          handleChange('results', {
                            ...results,
                            epithelialAbnormalities: {
                              ...results.epithelialAbnormalities,
                              squamousCells: {
                                ...results.epithelialAbnormalities.squamousCells,
                                carcinoma: e.target.checked,
                              },
                            },
                          })
                        }
                        className="rounded border-gray-300 text-indigo-600"
                        disabled={readOnly}
                      />
                      <label htmlFor="carcinoma">Carcinoma squamocelulare</label>
                    </div>
                  </div>
                </div>
              )}

{/* Glandular Cells Section */}
<div className="space-y-2">
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      id="glandularCells"
      checked={results.epithelialAbnormalities?.glandularCells?.selected || false}
      onChange={(e) =>
        handleChange('results', {
          ...results,
          epithelialAbnormalities: {
            ...results.epithelialAbnormalities,
            glandularCells: {
              ...(results.epithelialAbnormalities?.glandularCells || {}),
              selected: e.target.checked,
            },
          },
        })
      }
      className="rounded border-gray-300 text-indigo-600"
      disabled={readOnly}
    />
    <label htmlFor="glandularCells" className="font-medium">Qelizat glandulare</label>
  </div>

  {results.epithelialAbnormalities?.glandularCells?.selected && (
    <div className="ml-6 space-y-4 border-l-2 border-gray-100 pl-4">
      {/* Qeliza atipike with subchoices */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="qelizaAtipike"
            checked={results.epithelialAbnormalities?.glandularCells?.atypical?.selected || false}
            onChange={(e) => {
              const isChecked = e.target.checked;
              handleChange('results', {
                ...results,
                epithelialAbnormalities: {
                  ...results.epithelialAbnormalities,
                  glandularCells: {
                    ...results.epithelialAbnormalities.glandularCells,
                    atypical: {
                      ...(results.epithelialAbnormalities?.glandularCells?.atypical || {}),
                      selected: isChecked,
                      // Don't set any defaults - keep existing values
                    },
                  },
                },
              });
            }}
            className="rounded border-gray-300 text-indigo-600"
            disabled={readOnly}
          />
          <label htmlFor="qelizaAtipike" className="font-medium">Qeliza atipike</label>
        </div>
        
        {/* Atypical Subchoices */}
        {results.epithelialAbnormalities?.glandularCells?.atypical?.selected && (
          <div className="ml-6 space-y-2 border-l-2 border-gray-100 pl-4">
            {[
              { key: 'endocervical', label: 'endocervikale' },
              { key: 'endometrial', label: 'endometriale' },
              { key: 'glandular', label: 'glandulare' },
              { key: 'neoplastic', label: 'glandulare, i përngjajnë qelizave neoplastike (AGC)' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`atypical-${key}`}
                  checked={results.epithelialAbnormalities?.glandularCells?.atypical?.[key] || false}
                  onChange={(e) =>
                    handleChange('results', {
                      ...results,
                      epithelialAbnormalities: {
                        ...results.epithelialAbnormalities,
                        glandularCells: {
                          ...results.epithelialAbnormalities.glandularCells,
                          atypical: {
                            ...(results.epithelialAbnormalities?.glandularCells?.atypical || {}),
                            [key]: e.target.checked,
                          },
                        },
                      },
                    })
                  }
                  className="rounded border-gray-300 text-indigo-600"
                  disabled={readOnly}
                />
                <label htmlFor={`atypical-${key}`}>{label}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adenocarcinoma in situ */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="adenocarcinomaInSitu"
          checked={results.epithelialAbnormalities?.glandularCells?.adenocarcinomaInSitu || false}
          onChange={(e) =>
            handleChange('results', {
              ...results,
              epithelialAbnormalities: {
                ...results.epithelialAbnormalities,
                glandularCells: {
                  ...results.epithelialAbnormalities.glandularCells,
                  adenocarcinomaInSitu: e.target.checked,
                },
              },
            })
          }
          className="rounded border-gray-300 text-indigo-600"
          disabled={readOnly}
        />
        <label htmlFor="adenocarcinomaInSitu">Adenocarcinoma endocervikale in situ</label>
      </div>

      {/* Adenocarcinoma with subchoices */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="adenocarcinoma"
            checked={results.epithelialAbnormalities?.glandularCells?.adenocarcinoma?.selected || false}
            onChange={(e) => {
              const isChecked = e.target.checked;
              handleChange('results', {
                ...results,
                epithelialAbnormalities: {
                  ...results.epithelialAbnormalities,
                  glandularCells: {
                    ...results.epithelialAbnormalities.glandularCells,
                    adenocarcinoma: {
                      ...(results.epithelialAbnormalities?.glandularCells?.adenocarcinoma || {}),
                      selected: isChecked,
                      // Don't set any defaults - keep existing values
                    }
                  },
                },
              });
            }}
            className="rounded border-gray-300 text-indigo-600"
            disabled={readOnly}
          />
          <label htmlFor="adenocarcinoma" className="font-medium">Adenocarcinoma</label>
        </div>
        
        {/* Adenocarcinoma Subchoices */}
        {results.epithelialAbnormalities?.glandularCells?.adenocarcinoma?.selected && (
          <div className="ml-6 space-y-2 border-l-2 border-gray-100 pl-4">
            {[
              { key: 'endocervical', label: 'endocervikale' },
              { key: 'endometrial', label: 'endometriale' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`adenocarcinoma-${key}`}
                  checked={results.epithelialAbnormalities?.glandularCells?.adenocarcinoma?.[key] || false}
                  onChange={(e) =>
                    handleChange('results', {
                      ...results,
                      epithelialAbnormalities: {
                        ...results.epithelialAbnormalities,
                        glandularCells: {
                          ...results.epithelialAbnormalities.glandularCells,
                          adenocarcinoma: {
                            ...(results.epithelialAbnormalities?.glandularCells?.adenocarcinoma || {}),
                            [key]: e.target.checked
                          }
                        },
                      },
                    })
                  }
                  className="rounded border-gray-300 text-indigo-600"
                  disabled={readOnly}
                />
                <label htmlFor={`adenocarcinoma-${key}`}>{label}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Other Malignancy */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Tjetër neoplazi malinje:
        </label>
        <input
          type="text"
          value={results.epithelialAbnormalities?.glandularCells?.otherMalignancy || ''}
          onChange={(e) =>
            handleChange('results', {
              ...results,
              epithelialAbnormalities: {
                ...results.epithelialAbnormalities,
                glandularCells: {
                  ...results.epithelialAbnormalities.glandularCells,
                  otherMalignancy: e.target.value
                },
              },
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={readOnly}
        />
      </div>
    </div>
  )}
</div>
            </div>
          )}
          
          {/* Reactive Changes Section - Renamed to IV. PËRSHKRIMI */}
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">IV. PËRSHKRIMI</h3>
            
            {/* Ndryshime reaktive qelizore - Direct options */}
            <div className="space-y-2">
              <h4 className="font-medium">Ndryshime reaktive qelizore të shoqëruara me:</h4>
              <div className="ml-4 space-y-3">
                {/* Inflammation with subcategories */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="inflammation"
                      checked={results.reactiveChanges?.inflammation?.selected || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        handleChange('results', {
                          ...results,
                          reactiveChanges: {
                            ...(results.reactiveChanges || {}),
                            // Update the main selected flag based on any checkbox being checked
                            selected: isChecked || 
                                     (results.reactiveChanges?.squamousMetaplasia || false) || 
                                     (results.reactiveChanges?.atrophy || false) || 
                                     (results.reactiveChanges?.pregnancyRelated || false) || 
                                     (results.reactiveChanges?.hormonalStatus || false) || 
                                     (results.reactiveChanges?.endometrialCells || false),
                            inflammation: {
                              ...(results.reactiveChanges?.inflammation || {}),
                              selected: isChecked,
                            },
                          },
                        });
                      }}
                      className="rounded border-gray-300 text-indigo-600"
                      disabled={readOnly}
                    />
                    <label htmlFor="inflammation"><strong>Inflamacion</strong></label>
                  </div>
                  
                  {results.reactiveChanges?.inflammation?.selected && (
                    <div className="ml-6 space-y-2 border-l-2 border-gray-100 pl-4">
                      {[
                        { key: 'uid', label: 'Uid' },
                        { key: 'repair', label: 'Ndryshime reparatore' },
                        { key: 'radiation', label: 'Radiacion' },
                        { key: 'cylindricalCells', label: 'Qeliza cilindrike pas histerektomise' }
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`inflammation-${key}`}
                            checked={results.reactiveChanges?.inflammation?.[key] || false}
                            onChange={(e) =>
                              handleChange('results', {
                                ...results,
                                reactiveChanges: {
                                  ...results.reactiveChanges,
                                  inflammation: {
                                    ...(results.reactiveChanges?.inflammation || {}),
                                    [key]: e.target.checked,
                                  },
                                },
                              })
                            }
                            className="rounded border-gray-300 text-indigo-600"
                            disabled={readOnly}
                          />
                          <label htmlFor={`inflammation-${key}`}>{label}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Other reactive changes */}
                {[
                  { key: 'squamousMetaplasia', label: 'Metaplazion squamoz' },
                  { key: 'atrophy', label: 'Atrofi' },
                  { key: 'pregnancyRelated', label: 'Ndryshime të lidhura me shtatzëni' },
                  { key: 'hormonalStatus', label: 'Statusi citohormonal nuk i përgjigjet moshës' },
                  { key: 'endometrialCells', label: 'Qeliza endometriale (te femrat>=40 vjeç)' }
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`reactive-${key}`}
                      checked={results.reactiveChanges?.[key] || false}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        handleChange('results', {
                          ...results,
                          reactiveChanges: {
                            ...(results.reactiveChanges || {}),
                            // Update the main selected flag
                            selected: isChecked || 
                                     (results.reactiveChanges?.inflammation?.selected || false) || 
                                     (results.reactiveChanges?.squamousMetaplasia || false) || 
                                     (results.reactiveChanges?.atrophy || false) || 
                                     (results.reactiveChanges?.pregnancyRelated || false) || 
                                     (results.reactiveChanges?.hormonalStatus || false) || 
                                     (results.reactiveChanges?.endometrialCells || false),
                            [key]: isChecked,
                          },
                        });
                      }}
                      className="rounded border-gray-300 text-indigo-600"
                      disabled={readOnly}
                    />
                    <label htmlFor={`reactive-${key}`}>{label}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">V. UDHËZIME</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="repeatAfterTreatment"
              checked={recommendations.repeatAfterTreatment || false}
              onChange={(e) =>
                handleChange('recommendations', {
                  ...(recommendations || {}),
                  repeatAfterTreatment: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-indigo-600"
              disabled={readOnly}
            />
            <label htmlFor="repeatAfterTreatment">Të përsëritet analiza pas tretmanit</label>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Të përsëritet analiza pas:</label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={(recommendations.repeatAfterPeriod?.months || '')}
                onChange={(e) =>
                  handleChange('recommendations', {
                    ...recommendations,
                    repeatAfterPeriod: {
                      ...(recommendations.repeatAfterPeriod || {}),
                      months: e.target.value,
                    },
                  })
                }
                placeholder="Muaj"
                min="0"
                className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={readOnly}
              />
              <span>muajve/</span>
              <input
                type="number"
                value={(recommendations.repeatAfterPeriod?.years || '')}
                onChange={(e) =>
                  handleChange('recommendations', {
                    ...recommendations,
                    repeatAfterPeriod: {
                      ...(recommendations.repeatAfterPeriod || {}),
                      years: e.target.value,
                    },
                  })
                }
                placeholder="Viti"
                min="0"
                className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={readOnly}
              />
              <span>viti</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Të bëhet:</label>
            <div className="space-y-2 ml-4">
              {[
                { key: 'hpvTyping', label: 'HPV tipizimi' },
                { key: 'colposcopy', label: 'Kolposkopia' },
                { key: 'biopsy', label: 'Biopsia' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`recommendation-${key}`}
                    checked={recommendations[key] || false}
                    onChange={(e) =>
                      handleChange('recommendations', {
                        ...(recommendations || {}),
                        [key]: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-indigo-600"
                    disabled={readOnly}
                  />
                  <label htmlFor={`recommendation-${key}`}>{label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Komenti</label>
        <textarea
          value={comments || ''}
          onChange={(e) => handleChange('comments', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[100px]"
          placeholder="Shto komente shtesë..."
          disabled={readOnly}
        />
      </div>
    </div>
  );
};

export default PapTest2Form;