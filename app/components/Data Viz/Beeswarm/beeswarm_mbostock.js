import React, { useRef, useLayoutEffect } from 'react';
import * as d3 from 'd3';
import useElementSize from '../../../Hooks/useElementSize';
import styles from './beeswarm.css';

const BeeSwarm = ({ data }) => {
  const chartContainer = useRef(null);
  const { width, height } = useElementSize(chartContainer);

  // config
  const MARGIN = { top: 20, right: 20, bottom: 30, left: 20 };
  const PADDING = 0;
  const RADIUS = 2;

  const dodge = (data, radius, x, colorScale) => {
    const radius2 = radius ** 2;
    const circles = data
      .map(d => ({ x: x(d.value), data: d, color: colorScale(d.colorValue) }))
      .sort((a, b) => a.x - b.x);
    const epsilon = 1e-3;
    let head = null,
      tail = null;

    // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
    function intersects(x, y) {
      let a = head;
      while (a) {
        if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
          return true;
        }
        a = a.next;
      }
      return false;
    }

    // Place each circle sequentially.
    for (const b of circles) {
      // Remove circles from the queue that can’t intersect the new circle b.
      while (head && head.x < b.x - radius2) head = head.next;
      // Choose the minimum non-intersecting tangent.
      if (intersects(b.x, (b.y = 0))) {
        let a = head;
        b.y = Infinity;
        do {
          let y = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2);
          if (y < b.y && !intersects(b.x, y)) b.y = y;
          a = a.next;
        } while (a);
      }

      // Add b to the queue.
      b.next = null;
      if (head === null) head = tail = b;
      else tail = tail.next = b;
    }

    return circles;
  };

  useLayoutEffect(
    () => {
      if (chartContainer.current && width && height) {
        const xAxis = g =>
          g
            .attr('transform', `translate(0,${height - MARGIN.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        const d3ExtentColor = d3.extent(data, d => d.colorValue);

        const x = d3
          .scaleLinear()
          .domain(d3.extent(data, d => d.value))
          .range([MARGIN.left, width - MARGIN.right]);

        const colorScale = d3
          .scaleLinear()
          .domain([d3ExtentColor[0], d3ExtentColor[1]])
          .range(['#5a9bd3', 'red']);

        const svg = d3.select(chartContainer.current);

        svg.append('g').call(xAxis);

        svg
          .append('g')
          .selectAll('circle')
          .data(dodge(data, RADIUS * 2 + PADDING, x, colorScale))
          .enter()
          .append('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => height - MARGIN.bottom - RADIUS - PADDING - d.y)
          .attr('r', RADIUS)
          .attr('fill', d => d.color);
        return () => svg.selectAll('*').remove();
      }
    },
    [chartContainer, width, height, data, MARGIN, RADIUS, PADDING]
  );
  return <svg className={styles.container} ref={chartContainer} />;
};

export default BeeSwarm;
