const itinHistogramProps = {
  qInfo: {
    qType: 'contributionObj'
  },
  qHyperCubeDef: {
    qInitialDataFetch: [
      {
        qHeight: 2000,
        qWidth: 5
      }
    ],
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['[Travel Processing Office]'],
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
          qFieldDefs: ['Class'],
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
          qDef: '=Count(Distinct [%UN Travel Row ID])',
          qLabel: 'Carbon %'
        },
        qLibraryId: null
      },
      {
        qDef: {
          qDef: '=Sum([CO2 After Offsetting (kg)])',
          qLabel: 'Carbon %'
        },
        qLibraryId: null
      },
      {
        qDef: {
          qDef: '=Count( Distinct %Legs_RowID)',
          qLabel: 'Flights %'
        },
        qLibraryId: null
      },
      {
        qDef: {
          qDef: '=Sum([Trip Distance (km)])',
          qLabel: 'Distance %'
        },
        qLibraryId: null
      }
    ],
    qInterColumnSortOrder: [0, 1],
    qSuppressZero: false,
    qSuppressMissing: false,
    qMode: 'S'
  }
};

export default itinHistogramProps;
