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
  }
};

export default topLineMetrics;
