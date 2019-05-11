import React, { useRef, useState, useLayoutEffect, useContext } from 'react';

import useGenericObjectData from '../../Qlik/Hooks/useGenericObjectData';
import qlikContext from '../../Context/qlikContext';
import topLineMetrics from '../../Qlik/Object-Props/topLineMetrics';

import KPITile from './kpi-tile';
import BeeSwarmTile from './beeswarm-tile';
import CompositionTile from './distribution-tile';

import styles from './analysis.css';

const AnalysisContent = () => {
  return (
    <div className={styles.mainContainer}>
      <BeeSwarmTile />
    </div>
  );
};

export default AnalysisContent;
