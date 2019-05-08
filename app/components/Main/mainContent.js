import React, { useRef, useState, useLayoutEffect, useContext } from 'react';

import useGenericObjectData from '../../Qlik/Hooks/useGenericObjectData';
import qlikContext from '../../Context/qlikContext';
import topLineMetrics from '../../Qlik/Object-Props/topLineMetrics';

import KPITile from './kpi-tile';
import TrendTile from './trend-tile';

import styles from './mainContent.css';

const MainContent = () => {
  return (
    <div className={styles.mainContainer}>
      <KPITile />
      <TrendTile />
    </div>
  );
};

export default MainContent;
