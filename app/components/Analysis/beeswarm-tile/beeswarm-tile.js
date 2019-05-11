import React, { useContext, useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useObjectData from '../../../Qlik/Hooks/useObjectData';
import qlikContext from '../../../Context/qlikContext';
import flightCO2 from '../../../Qlik/Object-Props/flightCO2';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';
import BarChart from '../../Data Viz/Bar Chart';

import styles from './beeswarm-tile.css';

const BeeSwarmTile = () => {
  const { app$ } = useContext(qlikContext);
  const { data } = useObjectData(flightCO2, app$);
  const [chartNum, setChartNum] = useState(0);

  if (data) {
    console.log(data);

    const handleChange = (event, newValue) => {
      setChartNum(newValue);
    };

    return (
      <TileComponent title="Trends">
        <div className={styles.trendsContainer}>
          <div className={styles.tabContainer}>
            <Tabs value={chartNum} onChange={handleChange}>
              <Tab label="Itineraries" />
              <Tab label="Class" />
              <Tab label="Travel Type" />
              <Tab label="Travel Category" />
            </Tabs>
          </div>
        </div>
      </TileComponent>
    );
  }

  return null;
};

export default BeeSwarmTile;
