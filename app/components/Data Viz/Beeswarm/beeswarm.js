import React from 'react';

import styles from 'beeswawrm.css';

const BeeSwarm = ({ data }) => {
  const chartContainer = useRef(null);
  const { width, height } = useElementSize(chartContainer);

  return (
    <div className={styles.container} ref={chartContainer}>
      hello
    </div>
  );
};

export default BeeSwarm;
