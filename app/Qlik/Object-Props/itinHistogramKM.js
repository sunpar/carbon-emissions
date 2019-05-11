const itinHistogramPropsKM = {
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
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef: '=Only([Trip Distance (km)])',
          qLabel: 'Carbon'
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

export default itinHistogramPropsKM;
