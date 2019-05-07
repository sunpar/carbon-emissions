const topLineMetrics = {
  qInfo: {
    qType: 'brandObj'
  },
  totalCarbon: {
    qValueExpression: `=Sum({1} [CO2 After Offsetting (kg)])`
  },
  currentCarbon: {
    qValueExpression: `=Sum([CO2 After Offsetting (kg)])`
  },
  totalFlights: {
    qValueExpression: `=Count({1} Distinct %Legs_RowID)`
  },
  currentFlights: {
    qValueExpression: `=Count(Distinct %Legs_RowID)`
  },
  totalItineraries: {
    qValueExpression: `=Count({1} Distinct [%UN Travel Row ID])`
  },
  currentItineraries: {
    qValueExpression: `=Count(Distinct [%UN Travel Row ID])`
  },
  totalKM: {
    qValueExpression: `=Sum({1} [Trip Distance (km)])`
  },
  currentKM: {
    qValueExpression: `=Sum([Trip Distance (km)])`
  },
  qHyperCubeDef: {
    qInitialDataFetch: [
      {
        qHeight: 12,
        qWidth: 5
      }
    ],
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['[Departure Date.autoCalendar.Month]'],
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
          qDef: '=Sum([CO2 After Offsetting (kg)])',
          qLabel: 'Carbon'
        },
        qLibraryId: null
      },
      {
        qDef: {
          qDef: '=Count(Distinct [%UN Travel Row ID])',
          qLabel: 'Itineraries'
        },
        qLibraryId: null
      },
      {
        qDef: {
          qDef: '=Count(Distinct %Legs_RowID)',
          qLabel: 'Flights'
        },
        qLibraryId: null
      },
      {
        qDef: {
          qDef: '=Sum([Trip Distance (km)])',
          qLabel: 'Distance'
        },
        qLibraryId: null
      }
    ],
    qInterColumnSortOrder: [0, 1, 2, 3, 4],
    qSuppressZero: false,
    qSuppressMissing: false,
    qMode: 'S'
  }
};

export default topLineMetrics;
