const itinHistogramProps = {
  qInfo: {
    qType: 'contributionObj'
  },
  qHyperCubeDef: {
    qInitialDataFetch: [
      {
        qHeight: 5000,
        qWidth: 2
      }
    ],
    qDimensions: [
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
          qDef:
            '=Sum([CO2 After Offsetting (kg)])/Sum(TOTAL [CO2 After Offsetting (kg)])',
          qLabel: 'Carbon %'
        },
        qLibraryId: null
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef:
            '=Count(Distinct [%UN Travel Row ID])/Count(Distinct TOTAL [%UN Travel Row ID])',
          qLabel: 'Itinerary %'
        },
        qLibraryId: null
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef:
            '=Count( Distinct %Legs_RowID)/Count(TOTAL Distinct %Legs_RowID)',
          qLabel: 'Flights %'
        },
        qLibraryId: null
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef: '=Sum([Trip Distance (km)])/Sum(TOTAL [Trip Distance (km)])',
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
