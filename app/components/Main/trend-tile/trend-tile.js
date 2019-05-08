import React, { useContext, useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useGenericObjectData from '../../../Qlik/Hooks/useGenericObjectData';
import qlikContext from '../../../Context/qlikContext';
import topLineMetrics from '../../../Qlik/Object-Props/topLineMetrics';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';
import BarChart from '../../Data Viz/Bar Chart';

import styles from './trend-tile.css';

const TrendTile = () => {
  const { app$ } = useContext(qlikContext);
  const [chartNum, setChartNum] = useState(0);
  const { layout } = useGenericObjectData(topLineMetrics, app$);
  if (layout) {
    const cube = layout.qHyperCube.qDataPages[0].qMatrix;
    const trends = [
      {
        title: 'Carbon Emissions (kg)',
        data: cube.map(row => ({
          month: row[0].qText,
          value: row[1].qNum.toFixed(0)
        })),
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalCarbon.toFixed(0)),
          number: layout.totalCarbon
        },
        secondaryKPI: {
          label: 'Selection',
          value: numberWithCommas(layout.currentCarbon.toFixed(0)),
          number: layout.currentCarbon
        }
      },
      {
        title: 'Itineraries',
        data: cube.map(row => ({
          month: row[0].qText,
          value: row[2].qNum.toFixed(0)
        })),
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalItineraries.toFixed(0)),
          number: layout.totalItineraries
        },
        secondaryKPI: {
          label: 'Selection',
          value: numberWithCommas(layout.currentItineraries.toFixed(0)),
          number: layout.currentItineraries
        }
      },
      {
        title: 'Flights',
        data: cube.map(row => ({
          month: row[0].qText,
          value: row[3].qNum.toFixed(0)
        })),
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalFlights.toFixed(0)),
          number: layout.totalFlights
        },
        secondaryKPI: {
          label: 'Selection',
          value: numberWithCommas(layout.currentFlights.toFixed(0)),
          number: layout.currentFlights
        }
      },
      {
        title: 'Distance (KM)',
        data: cube.map(row => ({
          month: row[0].qText,
          value: row[4].qNum.toFixed(0)
        })),
        primaryKPI: {
          label: '2017 Total',
          value: numberWithCommas(layout.totalKM.toFixed(0)),
          number: layout.totalKM
        },
        secondaryKPI: {
          label: 'Selection',
          value: numberWithCommas(layout.currentKM.toFixed(0)),
          number: layout.currentKM
        }
      }
    ];

    const handleChange = (event, newValue) => {
      console.log(event, newValue);
      setChartNum(newValue);
    };
    console.log(chartNum);
    return (
      <TileComponent title="Trends">
        <div className={styles.trendsContainer}>
          <div className={styles.tabContainer}>
            <Tabs value={chartNum} onChange={handleChange}>
              <Tab label="Carbon Emissions" />
              <Tab label="Itineraries" />
              <Tab label="Flights" />
              <Tab label="Distance" />
            </Tabs>
          </div>
          {
            <div className={styles.singleTrend}>
              <BarChart data={trends[chartNum].data} />
            </div>
          }
        </div>
      </TileComponent>
    );
  }

  return null;
};

export default TrendTile;
