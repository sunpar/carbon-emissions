import React, { useContext, useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useObjectData from '../../../Qlik/Hooks/useObjectData';
import qlikContext from '../../../Context/qlikContext';
import contributionObj from '../../../Qlik/Object-Props/contributionObj';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';

import styles from './contribution-tile.css';

const ContributionTile = () => {
  const { app$ } = useContext(qlikContext);
  const { data } = useObjectData(contributionObj, app$);
  if (data) {
    console.log(data);

    return (
      <TileComponent title="Contribution">
        <div className={styles.trendsContainer}>
          <div className={styles.singleTrend}>
            <div className={styles.chartName}>
              Carbon (kg) (by # Itineraries)
            </div>
          </div>
          <div className={styles.singleTrend}>
            <div className={styles.chartName}>
              Distance (km) (by # Itineraries)
            </div>
          </div>
        </div>
      </TileComponent>
    );
  }

  return (
    <TileComponent title="Contribution">
      <div className={styles.trendsContainer}> </div>
    </TileComponent>
  );
};

export default ContributionTile;
