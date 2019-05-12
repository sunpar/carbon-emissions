import React, { useContext, useState, useEffect, useRef } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import useObjectData from '../../../Qlik/Hooks/useObjectData';
import qlikContext from '../../../Context/qlikContext';
import contributionObj from '../../../Qlik/Object-Props/contributionObj';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';
import MariMekko from '../../Data Viz/Marimekko';
import { ApplyPatches } from 'rxq/GenericObject';

import styles from './contribution-tile.css';

const ContributionTile = () => {
  const { app$ } = useContext(qlikContext);
  const { handle, data } = useObjectData(contributionObj, app$);
  const [chartNum, setChartNum] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setChartNum(newValue);
  };

  const isFirstRun = useRef(true);

  useEffect(
    () => {
      if (handle && isFirstRun.current) {
        isFirstRun.current = false;
      }
      if (handle && !isFirstRun.current) {
        let newDim = '[Traveler Type]';
        switch (chartNum) {
          case 0:
            newDim = '[Traveler Type]';
            break;
          case 1:
            newDim = '[Travel Type]';
            break;
          case 2:
            newDim = '[Travel Category]';
            break;
          case 3:
            newDim = '[Travel Processing Office]';
            break;
        }
        const sub = handle
          .ask(ApplyPatches, [
            {
              qOp: 'replace',
              qPath: '/qHyperCubeDef/qDimensions/0/qDef/qFieldDefs/0',
              qValue: JSON.stringify(newDim)
            }
          ])
          .subscribe();
        return () => sub.unsubscribe();
      }
    },
    [chartNum, handle]
  );

  if (data) {
    const formattedData1 = data.map(row => ({
      x: row[0].qText,
      y: row[1].qText,
      value: row[2].qNum.toFixed(0)
    }));

    const formattedData2 = data.map(row => ({
      x: row[0].qText,
      y: row[1].qText,
      value: row[3].qNum.toFixed(0)
    }));

    return (
      <TileComponent title="Travel Class Contribution">
        <div className={styles.tabContainer}>
          <Tabs value={chartNum} onChange={handleChangeTab}>
            <Tab label="Traveler Type" />
            <Tab label="Travel Type" />
            <Tab label="Travel Category" />
            <Tab label="TPO" />
          </Tabs>
        </div>
        <div className={styles.trendsContainer}>
          <div className={styles.singleTrend}>
            <div className={styles.chartTitle}>Itineraries</div>
            <MariMekko data={formattedData1} />
          </div>
          <div className={styles.singleTrend}>
            <div className={styles.chartTitle}>Carbon Emissions</div>
            <MariMekko data={formattedData2} />
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
