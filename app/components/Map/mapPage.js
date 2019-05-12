import React, { useRef, useState, useLayoutEffect, useContext } from 'react';
import styles from './mapPage.css';
import Map from './Map Container';
const MapPage = ({ classes }) => {
  return (
    <div className={styles.mapContainer}>
      <Map />
    </div>
  );
};

export default MapPage;
