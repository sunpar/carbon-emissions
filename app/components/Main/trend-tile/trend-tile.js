import React, { useContext, useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useGenericObjectData from '../../../Qlik/Hooks/useGenericObjectData';
import qlikContext from '../../../Context/qlikContext';
import monthlyTopMetricsProps from '../../../Qlik/Object-Props/monthlyTopMetrics';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';
import BarChart from '../../Data Viz/Bar Chart';

import styles from './trend-tile.css';

const TrendTile = () => {
  const { app$ } = useContext(qlikContext);
  const [chartNum, setChartNum] = useState(0);
  const { layout } = useGenericObjectData(monthlyTopMetricsProps, app$);
  if (layout) {
    const cube = layout.monthly.qHyperCube.qDataPages[0].qMatrix;
    const trends = [
      {
        title: 'Carbon Emissions (kg)',
        data: cube.map(row => ({
          dim: row[0].qText,
          value: row[1].qNum.toFixed(0)
        }))
      },
      {
        title: 'Itineraries',
        data: cube.map(row => ({
          dim: row[0].qText,
          value: row[2].qNum.toFixed(0)
        }))
      },
      {
        title: 'Flights',
        data: cube.map(row => ({
          dim: row[0].qText,
          value: row[3].qNum.toFixed(0)
        }))
      },
      {
        title: 'Distance (KM)',
        data: cube.map(row => ({
          dim: row[0].qText,
          value: row[4].qNum.toFixed(0)
        }))
      }
    ];

    const weeklyCube = layout.weekly.qHyperCube.qDataPages[0].qMatrix;
    const weeklyTrends = [
      {
        title: 'Carbon Emissions (kg)',
        data: weeklyCube.map(row => ({
          dim: row[0].qText,
          value: row[1].qNum.toFixed(0)
        }))
      },
      {
        title: 'Itineraries',
        data: weeklyCube.map(row => ({
          dim: row[0].qText,
          value: row[2].qNum.toFixed(0)
        }))
      },
      {
        title: 'Flights',
        data: weeklyCube.map(row => ({
          dim: row[0].qText,
          value: row[3].qNum.toFixed(0)
        }))
      },
      {
        title: 'Distance (KM)',
        data: weeklyCube.map(row => ({
          dim: row[0].qText,
          value: row[4].qNum.toFixed(0)
        }))
      }
    ];

    const handleChange = (event, newValue) => {
      setChartNum(newValue);
    };

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

          <div className={styles.singleTrend}>
            <BarChart
              data={trends[chartNum].data}
              selField={'Departure Date.autoCalendar.Month'}
            />
          </div>
          <div className={styles.singleTrend}>
            <BarChart
              data={weeklyTrends[chartNum].data}
              selField={'Departure Date.autoCalendar.Week'}
            />
          </div>
        </div>
      </TileComponent>
    );
  }

  return null;
};

export default TrendTile;
