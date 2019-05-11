import React, { useRef } from 'react';

import useElementSize from '../../../Hooks/useElementSize';
import styles from './beeswarm.css';

const BeeSwarm = ({ data }) => {
  const chartContainer = useRef(null);
  const { width, height } = useElementSize(chartContainer);

  return (
    <svg className={styles.container} ref={chartContainer}>
      hello
    </svg>
  );
};

export default BeeSwarm;
