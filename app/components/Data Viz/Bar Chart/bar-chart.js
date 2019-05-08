import React, { useRef, useLayoutEffect, useState } from 'react';
import * as d3 from 'd3';
import * as vega from 'vega';

import styles from './bar-chart.css';
import useElementSize from '../../../Hooks/useElementSize';

const LineChart = ({ data }) => {
  const chartContainer = useRef(null);
  const { width, height } = useElementSize(chartContainer);
  if (chartContainer && chartContainer.current) {
    const spec = _spec(width, height, data);
    const view = new vega.View(vega.parse(spec), {
      renderer: 'svg', // renderer (canvas or svg)
      container: chartContainer.current, // parent DOM container
      hover: true // enable hover processing
    });
    view.runAsync();
  }
  return <div className={styles.chartContainer} ref={chartContainer} />;
};

// the vega spec for the chart
const _spec = (width, height, data) => {
  return {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    width: width - 100,
    height: height - 50,
    padding: { top: 0, left: 0, bottom: 0, right: 0 },
    data: [{ name: 'table', values: data }],
    signals: [
      {
        name: 'tooltip',
        value: {},
        on: [
          { events: 'rect:mouseover', update: 'datum' },
          { events: 'rect:mouseout', update: '{}' }
        ]
      },
      {
        name: 'fontStyle',
        value: 'Rubik'
      }
    ],

    scales: [
      {
        name: 'xscale',
        type: 'band',
        domain: { data: 'table', field: 'month' },
        range: 'width',
        padding: 0.05,
        round: true
      },
      {
        name: 'yscale',
        domain: { data: 'table', field: 'value' },
        nice: true,
        range: 'height'
      }
    ],

    axes: [
      { orient: 'bottom', scale: 'xscale' },
      { orient: 'left', scale: 'yscale' }
    ],

    marks: [
      {
        type: 'rect',
        from: { data: 'table' },
        encode: {
          enter: {
            x: { scale: 'xscale', field: 'month' },
            width: { scale: 'xscale', band: 1 },
            y: { scale: 'yscale', field: 'value' },
            y2: { scale: 'yscale', value: 0 }
          },
          update: {
            fill: { value: '#5a9bd3' }
          },
          hover: {
            fill: { value: 'red' }
          }
        }
      },
      {
        type: 'text',
        encode: {
          enter: {
            align: { value: 'center' },
            baseline: { value: 'bottom' },
            fill: { value: '#333' }
          },
          update: {
            x: { scale: 'xscale', signal: 'tooltip.month', band: 0.5 },
            y: { scale: 'yscale', signal: 'tooltip.value', offset: -2 },
            text: {
              signal: 'tooltip.value'
            },
            fillOpacity: [
              { test: 'datum === tooltip', value: 0 },
              { value: 1 }
            ],
            fontStyle: { signal: 'fontStyle' }
          }
        }
      }
    ]
  };
};

export default LineChart;
