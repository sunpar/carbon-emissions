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
    qValueExpression: `=Sum({1} %Legs_RowID)`
  },
  currentFlights: {
    qValueExpression: `=Sum(%Legs_RowID)`
  },
  totalItineraries: {
    qValueExpression: `=Sum({1} [%UN Travel Row ID])`
  },
  currentItineraries: {
    qValueExpression: `=Sum([%UN Travel Row ID])`
  },
  totalKM: {
    qValueExpression: `=Sum({1} [Trip Distance (km)])`
  },
  currentKM: {
    qValueExpression: `=Sum([Trip Distance (km)])`
  }
};

export default topLineMetrics;
