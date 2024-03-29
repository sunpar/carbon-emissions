import React, { useRef, useLayoutEffect, useContext } from 'react';
import * as d3 from 'd3';
import styles from './beeswarm.css';
import useElementSize from '../../../Hooks/useElementSize';

import { GetField } from 'rxq/Doc';
import { SelectValues } from 'rxq/Field';
import { switchMap, take, shareReplay } from 'rxjs/operators';

import qlikContext from '../../../Context/qlikContext';

const svgStyle = (
  <style>
    {`
.axis path,
.axis line {
fill: none;
stroke: #000;
shape-rendering: crispEdges;
}

.axis text {
font: 10px Rubik;
}

.cells path {
fill: none;
pointer-events: all;
}

.cells circle {
opacity: 0.66;
}

.cells :hover circle {
r: 10;
opacity: 1;
}
`}
  </style>
);
const BeeSwarm = ({ data, extent, selField }) => {
  const chartContainer = useRef(null);

  // config
  const MARGIN = { top: 10, right: 10, bottom: 20, left: 10 };
  const PADDING = 0;
  const RADIUS = 4;
  const formatValue = d3.format(',d');

  const { app$, session } = useContext(qlikContext);

  const fld$ = app$.pipe(
    switchMap(h => h.ask(GetField, selField)),
    shareReplay(1)
  );

  const select = values => {
    fld$
      .pipe(
        switchMap(h => h.ask(SelectValues, values)),
        take(1)
      )
      .subscribe();
  };

  useLayoutEffect(
    () => {
      if (chartContainer.current) {
        const w =
            chartContainer.current.clientWidth - MARGIN.left - MARGIN.right,
          h = chartContainer.current.clientHeight - MARGIN.top - MARGIN.bottom;
        const svg = d3.select(chartContainer.current);
        const x = d3.scaleLog().rangeRound([0, w]);
        const g = svg
          .append('g')
          .attr(
            'transform',
            'translate(' + MARGIN.left + ',' + MARGIN.top + ')'
          );

        x.domain(extent ? extent : d3.extent(data, d => d.value));
        const simulation = d3
          .forceSimulation(data)
          .force(
            'x',
            d3
              .forceX(d => {
                return x(d.value);
              })
              .strength(1)
          )
          .force('y', d3.forceY(h / 2))
          .force('collide', d3.forceCollide(2))
          .stop();

        for (var i = 0; i < 180; ++i) simulation.tick();

        g.append('g')
          .attr('class', 'axis axis--x')
          .attr('transform', 'translate(0,' + h + ')')
          .call(d3.axisBottom(x).ticks(20, '.0s'));

        const cell = g
          .append('g')
          .attr('class', 'cells')
          .selectAll('g')
          .data(
            d3
              .voronoi()
              .extent([
                [-MARGIN.left, -MARGIN.top],
                [w + MARGIN.right, h + MARGIN.top]
              ])
              .x(d => d.x)
              .y(d => d.y)
              .polygons(data)
          )
          .enter()
          .append('g');

        const colorScale = d3
          .scaleLinear()
          .domain(d3.extent(data, d => d.colorValue))
          .range(['#5a9bd3', 'red']);

        cell
          .append('circle')
          .attr('r', 3)
          .attr('cx', d => {
            return d.data.x;
          })
          .attr('cy', d => d.data.y)
          .attr('fill', d => colorScale(d.data.colorValue));

        cell.on('click', d =>
          select([{
            qNumber: Number.parseInt(d.data.selectValue),
            qIsNumeric: true
          }])
        );

        cell.append('path').attr('d', d => 'M' + d.join('L') + 'Z');

        cell.append('title').text(d => {
          let tooltip = '';
          d.data.tooltips.forEach(value => {
            tooltip += value.label + ': ' + value.value + '\n';
          });
          return tooltip;
        });

        return () => g.selectAll('*').remove();
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

export default BeeSwarm;
