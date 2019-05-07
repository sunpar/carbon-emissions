import React, { useContext } from 'react';

import useGenericObjectData from '../../../Qlik/Hooks/useGenericObjectData';
import qlikContext from '../../../Context/qlikContext';
import topLineMetrics from '../../../Qlik/Object-Props/topLineMetrics';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';
import KPIComponent from '../../Data Viz/KPI';

import styles from './kpiTile.css';

const KPITile = () => {
  const { app$ } = useContext(qlikContext);

  const { layout } = useGenericObjectData(topLineMetrics, app$);
  if (layout) {
    const cube = layout.qHyperCube.qDataPages[0].qMatrix;
    const KPIs = [
      {
        title: 'Carbon Emissions (kg)',
        sparkline: cube.map(row => row[1].qNum),
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalCarbon.toFixed(0)),
          number: layout.totalCarbon
        },
        secondaryKPI:
          layout.totalCarbon !== layout.currentCarbon
            ? {
                label: 'Selection',
                value: numberWithCommas(layout.currentCarbon.toFixed(0)),
                number: layout.currentCarbon
              }
            : false
      },
      {
        title: 'Itineraries',
        sparkline: cube.map(row => row[2].qNum),
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalItineraries.toFixed(0)),
          number: layout.totalItineraries
        },
        secondaryKPI:
          layout.totalItineraries !== layout.currentItineraries
            ? {
                label: 'Selection',
                value: numberWithCommas(layout.currentItineraries.toFixed(0)),
                number: layout.currentItineraries
              }
            : false
      },
      {
        title: 'Flights',
        sparkline: cube.map(row => row[3].qNum),
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalFlights.toFixed(0)),
          number: layout.totalFlights
        },
        secondaryKPI:
          layout.totalFlights !== layout.currentFlights
            ? {
                label: 'Selection',
                value: numberWithCommas(layout.currentFlights.toFixed(0)),
                number: layout.currentFlights
              }
            : false
      },
      {
        title: 'Distance (KM)',
        sparkline: cube.map(row => row[4].qNum),
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalKM.toFixed(0)),
          number: layout.totalKM
        },
        secondaryKPI:
          layout.totalKM !== layout.currentKM
            ? {
                label: 'Selection',
                value: numberWithCommas(layout.currentKM.toFixed(0)),
                number: layout.currentKM
              }
            : false
      }
    ];

    return (
      <TileComponent title="Top Line Metrics">
        <div className={styles.kpiContainer}>
          {KPIs.map(kpi => (
            <div key={kpi.title} className={styles.singleKPI}>
              <KPIComponent
                title={kpi.title}
                primaryKPI={kpi.primaryKPI}
                secondaryKPI={kpi.secondaryKPI}
                sparkData={kpi.sparkline}
              />
            </div>
          ))}
        </div>
      </TileComponent>
    );
  }

  return null;
};

export default KPITile;
