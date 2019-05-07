import React, { useState, useLayoutEffect, useContext } from 'react';

import useGenericObjectData from '../../../Qlik/Hooks/useGenericObjectData';
import qlikContext from '../../../Context/qlikContext';
import topLineMetrics from '../../../Qlik/Object-Props/topLineMetrics';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';
import KPIComponent from '../../Data Viz/KPI';

import styles from './kpiTile.css';

const KPITile = () => {
  const context = useContext(qlikContext);

  const primaryKPI = {
    label: '2017 Total',
    value: 3655480
  };

  const secondaryKPI = {
    label: 'Selection',
    value: 3655480
  };

  const { layout } = useGenericObjectData(topLineMetrics, context.app$);
  if (layout) {
    console.log(layout);
    const KPIs = [
      {
        title: 'Carbon Emissions (kg)',
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalCarbon.toFixed(0))
        },
        secondaryKPI:
          layout.totalCarbon !== layout.currentCarbon
            ? {
                label: 'Selection',
                value: numberWithCommas(layout.currentCarbon.toFixed(0))
              }
            : false
      },
      {
        title: 'Itineraries',
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalItineraries.toFixed(0))
        },
        secondaryKPI:
          layout.totalItineraries !== layout.currentItineraries
            ? {
                label: 'Selection',
                value: numberWithCommas(layout.currentItineraries.toFixed(0))
              }
            : false
      },
      {
        title: 'Flights',
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalFlights.toFixed(0))
        },
        secondaryKPI:
          layout.totalFlights !== layout.currentFlights
            ? {
                label: 'Selection',
                value: numberWithCommas(layout.currentFlights.toFixed(0))
              }
            : false
      },
      {
        title: 'Distance (KM)',
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalKM.toFixed(0))
        },
        secondaryKPI:
          layout.totalKM !== layout.currentKM
            ? {
                label: 'Selection',
                value: numberWithCommas(layout.currentKM.toFixed(0))
              }
            : false
      }
    ];

    return (
      <TileComponent title="Top Line Metrics">
        <div className={styles.kpiContainer}>
          {KPIs.map(kpi => {
            return (
              <div key={kpi.title} className={styles.singleKPI}>
                <KPIComponent
                  title={kpi.title}
                  primaryKPI={kpi.primaryKPI}
                  secondaryKPI={kpi.secondaryKPI}
                />
              </div>
            );
          })}
        </div>
      </TileComponent>
    );
  }

  return null;
};

export default KPITile;
