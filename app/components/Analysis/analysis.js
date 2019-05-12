import React, { useRef, useState, useLayoutEffect, useContext } from 'react';

import useGenericObjectData from '../../Qlik/Hooks/useGenericObjectData';
import qlikContext from '../../Context/qlikContext';
import topLineMetrics from '../../Qlik/Object-Props/topLineMetrics';

import KPITile from './kpi-tile';
import BeeSwarmTile from './beeswarm-tile';
import ContributionTile from './contribution-tile';

import styles from './analysis.css';

const AnalysisContent = () => {
  return (
    <div className={styles.mainContainer}>
      {/* <BeeSwarmTile /> */}
      <ContributionTile />
    </div>
  );
};

export default AnalysisContent;
