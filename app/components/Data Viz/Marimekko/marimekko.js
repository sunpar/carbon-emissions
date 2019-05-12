import React, { useRef, useLayoutEffect, cloneElement } from 'react';
import * as d3 from 'd3';
import styles from './marimekko.css';

const svgStyle = <style>{``}</style>;
const MariMekko = ({ data }) => {
  const chartContainer = useRef(null);

  // config
  const MARGIN = { top: 30, right: -1, bottom: -1, left: 1 };
  const PADDING = 0;
  const RADIUS = 4;
  const formatValue = d3.format(',d');

  useLayoutEffect(
    () => {
      if (chartContainer.current) {
        const width = chartContainer.current.clientWidth,
          height = chartContainer.current.clientHeight;
        const color = d3
          .scaleOrdinal(d3.schemeCategory10)
          .domain(data.map(d => d.y));

        const format = d => d.toLocaleString();
        const treemap = data =>
          d3
            .treemap()
            .round(true)
            .tile(d3.treemapSliceDice)
            .size([
              width - MARGIN.left - MARGIN.right,
              height - MARGIN.top - MARGIN.bottom
            ])(
              d3
                .hierarchy(
                  {
                    values: d3
                      .nest()
                      .key(d => d.x)
                      .key(d => d.y)
                      .entries(data)
                  },
                  d => d.values
                )
                .sum(d => d.value)
            )
            .each(d => {
              d.x0 += MARGIN.left;
              d.x1 += MARGIN.left;
              d.y0 += MARGIN.top;
              d.y1 += MARGIN.top;
            });

        const root = treemap(data);

        const svg = d3
          .select(chartContainer.current)
          .style('width', '100%')
          .style('font', '12px Rubik');

        const node = svg
          .selectAll('g')
          .data(root.descendants())
          .join('g')
          .attr('transform', d => `translate(${d.x0},${d.y0})`);

        const column = node.filter(d => d.depth === 1);

        column
          .append('text')
          .attr('x', 3)
          .attr('y', '-1.7em')
          .style('font-weight', 'bold')
          .text(d => {
            if (d.x1 - d.x0 - 1 > 25) {
              return d.data.key;
            }
            return '';
          });

        column
          .append('text')
          .attr('x', 3)
          .attr('y', '-0.5em')
          .attr('fill-opacity', 0.7)
          .text(d => {
            if (d.x1 - d.x0 - 1 > 25) {
              return format(d.value);
            }
            return '';
          });

        column
          .append('line')
          .attr('x1', -0.5)
          .attr('x2', -0.5)
          .attr('y1', -30)
          .attr('y2', d => d.y1 - d.y0)
          .attr('stroke', '#000');

        const cell = node.filter(d => d.depth === 2);

        cell
          .append('rect')
          .attr('fill', d => color(d.data.key))
          .attr('fill-opacity', (d, i) => d.value / d.parent.value)
          .attr('width', d => d.x1 - d.x0 - 1)
          .attr('height', d => d.y1 - d.y0 - 1);

        cell
          .append('text')
          .attr('x', 3)
          .attr('y', '1.1em')
          .text(d => {
            if (d.x1 - d.x0 - 1 > 25) {
              return d.data.key;
            }
            return '';
          });

        cell
          .append('text')
          .attr('x', 3)
          .attr('y', '2.3em')
          .attr('fill-opacity', 0.7)
          .text(d => {
            if (d.x1 - d.x0 - 1 > 25) {
              return format(d.value);
            }
            return '';
          });

        cell.append('title').text(d => {
          let tooltip = '';
          tooltip += d.parent.data.key + ': ' + format(d.parent.value) + '\n';
          tooltip += d.data.key + ': ' + format(d.value) + '\n';
          return tooltip;
        });

        svg.node();

        return () => svg.selectAll('g').remove();
      }
      return () => {};
    },
    [chartContainer, data, MARGIN, RADIUS, PADDING]
  );
  return (
    <svg className={styles.container} ref={chartContainer}>
      {svgStyle}
    </svg>
  );
};

export default MariMekko;
