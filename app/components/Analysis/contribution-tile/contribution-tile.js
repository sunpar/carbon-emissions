import React, { useContext, useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useObjectData from '../../../Qlik/Hooks/useObjectData';
import qlikContext from '../../../Context/qlikContext';
import contributionObj from '../../../Qlik/Object-Props/contributionObj';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';
import MariMekko from '../../Data Viz/Marimekko';

import styles from './contribution-tile.css';

const ContributionTile = () => {
  const { app$ } = useContext(qlikContext);
  const { data } = useObjectData(contributionObj, app$);
  if (data) {
    console.log(data);
    const formattedData = data.map(row => ({
      x: row[0].qText,
      y: row[1].qText,
      value: row[2].qNum.toFixed(0)
    }));

    return (
      <TileComponent title="Contribution">
        <div className={styles.trendsContainer}>
          <MariMekko data={formattedData} />
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
