const itinHistogramProps = {
  qInfo: {
    qType: 'itinHistogram'
  },
  qHyperCubeDef: {
    qInitialDataFetch: [
      {
        qHeight: 0,
        qWidth: 0
      }
    ],
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['=1'],
          qSortCriterias: [
            {
              qSortByNumeric: 1,
              qSortByAscii: 0,
              qSortByLoadOrder: 0,
              qExpression: {}
            }
          ]
        },
        qNullSuppression: true
      },
      {
        qDef: {
          qFieldDefs: ['[%UN Travel Row ID]'],
          qSortCriterias: [
            {
              qSortByNumeric: 1,
              qSortByAscii: 0,
              qSortByLoadOrder: 0,
              qExpression: {}
            }
          ]
        },
        qNullSuppression: true
      },
      {
        qDef: {
          qFieldDefs: ['Itinerary'],
          qSortCriterias: [
            {
              qSortByNumeric: 1,
              qSortByAscii: 0,
              qSortByLoadOrder: 0,
              qExpression: {}
            }
          ]
        },
        qNullSuppression: true
      },
      {
        qDef: {
          qFieldDefs: ['[Departure Date]'],
          qSortCriterias: [
            {
              qSortByNumeric: 1,
              qSortByAscii: 0,
              qSortByLoadOrder: 0,
              qExpression: {}
            }
          ]
        },
        qNullSuppression: true
      },
      {
        qDef: {
          qFieldDefs: ['[Class]'],
          qSortCriterias: [
            {
              qSortByNumeric: 1,
              qSortByAscii: 0,
              qSortByLoadOrder: 0,
              qExpression: {}
            }
          ]
        },
        qNullSuppression: true
      },
      {
        qDef: {
          qFieldDefs: ['[Travel Category]'],
          qSortCriterias: [
            {
              qSortByNumeric: 1,
              qSortByAscii: 0,
              qSortByLoadOrder: 0,
              qExpression: {}
            }
          ]
        },
        qNullSuppression: true
      },
      {
        qDef: {
          qFieldDefs: ['[Travel Type]'],
          qSortCriterias: [
            {
              qSortByNumeric: 1,
              qSortByAscii: 0,
              qSortByLoadOrder: 0,
              qExpression: {}
            }
          ]
        },
        qNullSuppression: true
      },
      {
        qDef: {
          qFieldDefs: ['[Traveler Type]'],
          qSortCriterias: [
            {
              qSortByNumeric: 1,
              qSortByAscii: 0,
              qSortByLoadOrder: 0,
              qExpression: {}
            }
          ]
        },
        qNullSuppression: true
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef: '=Only([CO2 After Offsetting (kg)])',
          qLabel: 'Carbon'
        },
        qLibraryId: null
      },
      {
        qDef: {
          qDef: '=Only([Trip Distance (km)])',
          qLabel: 'Carbon'
        },
        qLibraryId: null
      },
      {
        qDef: {
          qDef: '=Count(Distinct [%Legs_RowID])',
          qLabel: 'Carbon'
        },
        qLibraryId: null
      }
    ],
    qInterColumnSortOrder: [0, 1, 2],
    qSuppressZero: false,
    qSuppressMissing: false,
    qMode: 'S'
  }
};

export default itinHistogramProps;
