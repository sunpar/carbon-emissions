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
  totalFlights: {
    qValueExpression: `=Sum({1} [%UN Travel Row ID])`
  },
  currentFlights: {
    qValueExpression: `=Sum([%UN Travel Row ID])`
  }
};

export default topLineMetrics;
