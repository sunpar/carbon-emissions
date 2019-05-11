const airportGEOProps = {
    qInfo: {
      qType: "AirportGeoJSon"
    },
    qHyperCubeDef: {
      qInitialDataFetch: [
        {
          qHeight: 1000,
          qWidth: 10
        }
      ],
      qDimensions: [
        {
          qDef: {
            qFieldDefs: ["Origin.Name"],
            qSortCriterias: [
              {
                qSortByNumeric: 0,
                qSortByAscii: 1,
                qSortByLoadOrder: 0,
                qExpression: {}
              }
            ]
          },
          qTotalLabel: {},
          qCalcCond: {},
          qAttributeExpressions: [],
          qAttributeDimensions: [],
          qCalcCondition: {
            qCond: {},
            qMsg: {}
          },
          qNullSuppression: true
        },
        {
            qDef: {
              qFieldDefs: ["Origin.GEOJson"],
              qSortCriterias: [
                {
                  qSortByNumeric: 0,
                  qSortByAscii: 1,
                  qSortByLoadOrder: 0,
                  qExpression: {}
                }
              ]
            },
            qTotalLabel: {},
            qCalcCond: {},
            qAttributeExpressions: [],
            qAttributeDimensions: [],
            qCalcCondition: {
              qCond: {},
              qMsg: {}
            },
            qNullSuppression: true
          }
      ],
      qMeasures: [
        {
          qDef: {
            qDef:
              "Count(Distinct [%Legs_RowID])",
            qLabel: "GEOJson"
          },
          qLabel: "Max",
          qLibraryId: null,
          qSortBy: {
            qSortByState: 0,
            qSortByFrequency: 0,
            qSortByNumeric: -1,
            qSortByAscii: 0,
            qSortByLoadOrder: 0,
            qSortByExpression: 0,
            qExpression: {
              qv: " "
            }
          }
        },
        {
          qDef: {
            qDef:
              "=Sum([CO2 After Offsetting (kg)])/Count(Distinct  [%Legs_RowID])",
            qLabel: "CO2 per Flight"
          },
          qLabel: "Max",
          qLibraryId: null,
          qSortBy: {
            qSortByState: 0,
            qSortByFrequency: 0,
            qSortByNumeric: -1,
            qSortByAscii: 0,
            qSortByLoadOrder: 0,
            qSortByExpression: 0,
            qExpression: {
              qv: " "
            }
          }
        }
      ],
      qInterColumnSortOrder: [0, 1, 2],
      qSuppressZero: false,
      qSuppressMissing: false,
      qMode: "S"
    }
  };
  
  export default airportGEOProps;