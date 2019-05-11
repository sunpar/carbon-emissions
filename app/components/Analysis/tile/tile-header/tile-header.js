import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import excelExport from '../../../../_assets/excelExport.png';
import pngExport from '../../../../_assets/pngExport.png';

import styles from './tile-header.css';

const TileHeaderComponent = ({
  title,
  handleIndexChange,
  onPrint = false,
  onExport = false,
  showIndexToggle = false
}) => {
  const [index, changeIndex] = useState('index');

  const firstUpdate = useRef(true);
  useEffect(
    () => {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      if (handleIndexChange) handleIndexChange(index);
    },
    [index]
  );

  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <div className={styles.tileHeaderContainer}>
      <div className={styles.tileTitle}>{title}</div>
      <div className={styles.utilityContainer}>
        {showIndexToggle ? (
          <>
            <div
              className={index === 'index' ? styles.active : styles.inactive}
              onClick={() => changeIndex('index')}
            >
              Index
            </div>
            <div
              className={
                index === 'composite' ? styles.active : styles.inactive
              }
              onClick={() => changeIndex('composite')}
            >
              Composite
            </div>
          </>
        ) : null}

        <div className={styles.spacer} />
        {onExport ? (
          <img
            src={excelExport}
            alt="PDF Export"
            className={styles.image}
            onClick={onExport}
          />
        ) : null}
        {onPrint ? (
          <img
            src={pngExport}
            alt="PDF Export"
            className={styles.image}
            onClick={onPrint}
          />
        ) : null}
      </div>
    </div>
  );
};

TileHeaderComponent.propTypes = {
  children: PropTypes.node,
  onPrint: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  handleIndexChange: PropTypes.func,
  onExport: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  showIndexToggle: PropTypes.bool
};

export default TileHeaderComponent;
