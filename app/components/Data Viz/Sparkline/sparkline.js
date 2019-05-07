import React, { useRef, useLayoutEffect, useState } from 'react';
import * as d3 from 'd3';

import styles from './sparkline.css';
import useElementSize from '../../../Hooks/useElementSize';

const SparkLine = ({ data }) => {
  const [linePath, setLinePath] = useState(null);
  const sparkEl = useRef(null);
  const { width, height } = useElementSize(sparkEl);
  useLayoutEffect(
    () => {
      const min = d3.min(data);
      const max = d3.max(data);
      const x = d3
        .scaleLinear()
        .domain([0, data.length - 1])
        .range([0, width]);
      const y = d3
        .scaleLinear()
        .domain([min, max])
        .range([0, height]);
      const line = d3
        .line()
        .x((d, i) => x(i))
        .y(d => y(d));

      setLinePath(line(data));
    },
    [data, width, height]
  );
  if (linePath) {
    return (
      <svg className={styles.sparkContainer} ref={sparkEl}>
        <path d={linePath} stroke="steelblue" fill="none" strokeWidth={1} />
      </svg>
    );
  }
  return <svg className={styles.sparkContainer} ref={sparkEl} />;
};

export default SparkLine;
