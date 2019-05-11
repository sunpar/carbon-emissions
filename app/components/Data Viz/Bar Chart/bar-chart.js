import React, { useRef, useLayoutEffect, useState, useContext } from 'react';
import * as d3 from 'd3';
import * as vega from 'vega';

import { GetField } from 'rxq/Doc';
import { ToggleSelect } from 'rxq/Field';
import { switchMap, take, shareReplay } from 'rxjs/operators';

import styles from './bar-chart.css';
import useElementSize from '../../../Hooks/useElementSize';
import qlikContext from '../../../Context/qlikContext';

const BarChart = ({ data, selField }) => {
  const chartContainer = useRef(null);
  const { width, height } = useElementSize(chartContainer);

  const { app$, session } = useContext(qlikContext);

  const fld$ = app$.pipe(
    switchMap(h => h.ask(GetField, selField)),
    shareReplay(1)
  );

  const select = value => {
    fld$
      .pipe(
        switchMap(h => h.ask(ToggleSelect, value)),
        take(1)
      )
      .subscribe();
  };

  useLayoutEffect(
    () => {
      if (chartContainer && chartContainer.current) {
        const spec = _spec(width, height, data);
        const view = new vega.View(vega.parse(spec), {
          renderer: 'svg', // renderer (canvas or svg)
          container: chartContainer.current, // parent DOM container
          hover: true // enable hover processing
        });

        view.runAsync();
        view.addSignalListener('rectClick', (name, value) => select(value.dim));
        return () => {
          view.removeSignalListener('rectClick', (name, value) =>
            select(value.dim)
          );
        };
      }
      return () => {};
    },
    [chartContainer.current, data]
  );
  // if (chartContainer && chartContainer.current) {
  //   const spec = _spec(width, height, data);
  //   const view = new vega.View(vega.parse(spec), {
  //     renderer: 'svg', // renderer (canvas or svg)
  //     container: chartContainer.current, // parent DOM container
  //     hover: true // enable hover processing
  //   });

  //   view.runAsync();
  //   view.addSignalListener('rectClick', (name, value) => select(value.dim));
  // }
  return <div className={styles.chartContainer} ref={chartContainer} />;
};

// the vega spec for the chart
const _spec = (width, height, data) => {
  return {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    width: width - 100,
    height: height - 50,
    padding: { top: 0, left: 0, bottom: 20, right: 0 },
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
        name: 'rectClick',
        value: null,
        on: [{ events: 'rect:click', update: 'datum' }]
      }
    ],

    scales: [
      {
        name: 'xscale',
        type: 'band',
        domain: { data: 'table', field: 'dim' },
        range: 'width',
        padding: 0.3,
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
      {
        orient: 'bottom',
        scale: 'xscale',
        labelAngle: -40,
        labelFont: 'Rubik',
        bandPosition: 1,
        labelAlign: 'right',
        labelBaseline: 'top',
        bandPosition: 0.5
      },
      {
        orient: 'left',
        scale: 'yscale',
        ticks: false,
        labelFont: 'Rubik',
        tickCount: 5
      }
    ],

    marks: [
      {
        type: 'rect',
        from: { data: 'table' },
        encode: {
          enter: {
            x: { scale: 'xscale', field: 'dim' },
            width: { scale: 'xscale', band: 1 },
            y: { scale: 'yscale', field: 'value' },
            y2: { scale: 'yscale', value: 0 }
          },
          update: {
            fill: { value: '#5a9bd3' }
          },
          hover: {
            fill: { value: 'dark green' }
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
            x: { scale: 'xscale', signal: 'tooltip.dim', band: 0.5 },
            y: { scale: 'yscale', signal: 'tooltip.value', offset: -2 },
            text: {
              signal: 'tooltip.value'
            },
            fillOpacity: [{ test: 'datum === tooltip', value: 0 }, { value: 1 }]
          }
        }
      }
    ]
  };
};

export default BarChart;
