import React, { useContext, useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useObjectData from '../../../Qlik/Hooks/useObjectData';
import qlikContext from '../../../Context/qlikContext';
import flightCO2 from '../../../Qlik/Object-Props/flightCO2';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';
import Beeswarm from '../../Data Viz/Beeswarm';

import styles from './beeswarm-tile.css';

const BeeSwarmTile = () => {
  const { app$ } = useContext(qlikContext);
  const { handle, data } = useObjectData(flightCO2, app$);
  const [chartNum, setChartNum] = useState(0);
  const [valueNum, setValueNum] = useState(0);
  const [colorNum, setColorNum] = useState(1);

  if (data) {
    const formatData = data
      .map(row => ({
        tooltips: [
          { label: 'Itinerary', value: row[2].qText },
          { label: 'Departure Date', value: row[3].qText },
          { label: 'Travel Class', value: row[4].qText },
          { label: 'Travel Category', value: row[5].qText },
          { label: 'Travel Type', value: row[6].qText },
          { label: 'Traveler Type', value: row[7].qText },
          { label: '# Flights', value: row[10].qNum }
        ],
        value: [row[8].qNum, row[9].qNum][valueNum],
        colorValue: [row[8].qNum, row[9].qNum, row[10].qNum][colorNum]
      }))
      .slice(0, 1000);

    const handleChange = (event, newValue) => {
      setChartNum(newValue);
    };

    return (
      <TileComponent title="Distribution">
        <div className={styles.trendsContainer}>
          <div className={styles.tabContainer}>
            <Tabs value={chartNum} onChange={handleChange}>
              <Tab label="Itineraries" />
              <Tab label="Class" />
              <Tab label="Travel Type" />
              <Tab label="Travel Category" />
            </Tabs>
          </div>
          <div className={styles.chartContainer}>
            <Beeswarm data={formatData} />
          </div>
        </div>
      </TileComponent>
    );
  }

  return null;
};

export default BeeSwarmTile;
