import React from 'react';
import * as d3 from 'd3';

import styles from './bar.css';

const PartWholeBar = ({ percent, width }) => {
  const margin = {
    left: 50,
    right: 10,
    top: 5,
    bottom: 5
  };
  const innerWidth = width - margin.left - margin.right;
  const x = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, innerWidth]);
  return (
    <>
      <text
        className={styles.chartLabel}
        transform={`translate(${margin.left - 5},0)`}
        y={margin.top}
        dy="10px"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <g transform={`translate(${margin.left},0)`}>
        <rect
          className={styles.barFirst}
          x={x(0)}
          y={0}
          width={x(percent)}
          height={20}
        />
        <rect
          className={styles.barSecond}
          x={x(percent)}
          y={0}
          width={x(1 - percent)}
          height={20}
        />
      </g>
    </>
  );
};

export default PartWholeBar;
