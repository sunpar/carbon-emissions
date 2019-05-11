import React, { useContext, useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useObjectData from '../../../Qlik/Hooks/useObjectData';
import qlikContext from '../../../Context/qlikContext';
import itinHistogramProps from '../../../Qlik/Object-Props/itinHistogram';
import itinHistogramPropsKM from '../../../Qlik/Object-Props/itinHistogramKM';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';
import Histogram from '../../Data Viz/Histogram';

import styles from './distribution-tile.css';

const DistributionTile = () => {
  const { app$ } = useContext(qlikContext);
  const { data: carbon } = useObjectData(itinHistogramProps, app$);
  const { data: distance } = useObjectData(itinHistogramPropsKM, app$);
  if (carbon && distance) {
    const carbonData = carbon.map(row => ({
      value: row[1].qNum,
      dim: row[0].qText
    }));
    const distanceData = distance.map(row => ({
      value: row[1].qNum,
      dim: row[0].qText
    }));

    return (
      <TileComponent title="Distribution">
        <div className={styles.trendsContainer}>
          <div className={styles.singleTrend}>
            <div className={styles.chartName}>
              Carbon (kg) (by # Itineraries)
            </div>
            <Histogram data={carbonData} selField={'[%UN Travel Row ID]'} />
          </div>
          <div className={styles.singleTrend}>
            <div className={styles.chartName}>
              Distance (km) (by # Itineraries)
            </div>
            <Histogram data={distanceData} selField={'[%UN Travel Row ID]'} />
          </div>
        </div>
      </TileComponent>
    );
  }

  return null;
};

export default DistributionTile;
