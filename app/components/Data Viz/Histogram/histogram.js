import React, { useRef, useLayoutEffect, useState, useContext } from 'react';
import * as d3 from 'd3';
import * as vega from 'vega';

import { GetField } from 'rxq/Doc';
import { SelectValues } from 'rxq/Field';
import { switchMap, take, shareReplay } from 'rxjs/operators';

import styles from './histogram.css';
import useElementSize from '../../../Hooks/useElementSize';
import qlikContext from '../../../Context/qlikContext';

const Histogram = ({ data, selField }) => {
  const chartContainer = useRef(null);
  const { width, height } = useElementSize(chartContainer);

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

  const handler = (name, value) => {
    const dimsToSelect = value.data
      .filter(
        item => item.value > value.datum.bin0 && item.value < value.datum.bin1
      )
      .map(item => ({
        qNumber: Number.parseInt(item.dim),
        qIsNumeric: true
      }));
    select(dimsToSelect);
  };

  useLayoutEffect(
    () => {
      if (chartContainer && chartContainer.current) {
        const min = d3.min(data.map(row => row.value));
        const max = d3.max(data.map(row => row.value));
        const spec = _spec(width, height, data, min, max);
        const view = new vega.View(vega.parse(spec), {
          renderer: 'svg', // renderer (canvas or svg)
          container: chartContainer.current, // parent DOM container
          hover: true // enable hover processing
        });

        view.runAsync();
        view.addSignalListener('rectClick', handler);
        return () => {
          view.removeSignalListener('rectClick', handler);
        };
      }
      return () => {};
    },
    [chartContainer.current, data]
  );
  return <div className={styles.chartContainer} ref={chartContainer} />;
};

// the vega spec for the chart
const _spec = (width, height, data, min, max) => {
  return {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    width: width - 100,
    height: height - 75,
    padding: 0,
    signals: [
      {
        name: 'binOffset',
        value: 0,
        bind: {
          input: 'range',
          min: 0,
          max: max
        }
      },
      {
        name: 'binStep',
        value: (max / 20).toFixed(0),
        bind: {
          input: 'range',
          min: 0,
          max: max,
          step: 10
        }
      },
      {
        name: 'rectClick',
        value: null,
        on: [
          {
            events: 'rect:click',
            update: '{datum: datum, data: data("points")}'
          }
        ]
      }
    ],
    data: [
      {
        name: 'points',
        values: data
      },
      {
        name: 'binned',
        source: 'points',
        transform: [
          {
            type: 'bin',
            field: 'value',
            extent: [Math.max(0, min * 0.9), max],
            anchor: {
              signal: 'binOffset'
            },
            step: {
              signal: 'binStep'
            },
            nice: false
          },
          {
            type: 'aggregate',
            key: 'bin0',
            groupby: ['bin0', 'bin1'],
            fields: ['bin0'],
            ops: ['count'],
            as: ['count']
          }
        ]
      }
    ],
    scales: [
      {
        name: 'xscale',
        type: 'linear',
        range: 'width',
        domain: [Math.max(0, min * 0.9), max]
      },
      {
        name: 'yscale',
        type: 'linear',
        range: 'height',
        round: true,
        domain: {
          data: 'binned',
          field: 'count'
        },
        zero: true,
        nice: true
      }
    ],
    axes: [
      {
        orient: 'bottom',
        scale: 'xscale',
        zindex: 1
      },
      {
        orient: 'left',
        scale: 'yscale',
        tickCount: 5,
        zindex: 1
      }
    ],
    marks: [
      {
        type: 'rect',
        from: {
          data: 'binned'
        },
        encode: {
          update: {
            x: {
              scale: 'xscale',
              field: 'bin0'
            },
            x2: {
              scale: 'xscale',
              field: 'bin1',
              offset: {
                signal: 'binStep > 0.02 ? -0.5 : 0'
              }
            },
            y: {
              scale: 'yscale',
              field: 'count'
            },
            y2: {
              scale: 'yscale',
              value: 0
            },
            fill: {
              value: '#5a9bd3'
            }
          },
          hover: {
            fill: {
              value: 'firebrick'
            }
          }
        }
      },
      {
        type: 'rect',
        from: {
          data: 'points'
        },
        encode: {
          enter: {
            x: {
              scale: 'xscale',
              field: 'value'
            },
            width: {
              value: 1
            },
            y: {
              value: 25,
              offset: {
                signal: 'height'
              }
            },
            height: {
              value: 5
            },
            fill: {
              value: '#5a9bd3'
            },
            fillOpacity: {
              value: 0.1
            }
          }
        }
      },
      {
        type: 'text',
        from: {
          data: 'binned'
        },
        encode: {
          enter: {
            align: { value: 'center' },
            baseline: { value: 'bottom' },
            fill: { value: '#333' }
          },
          update: {
            x: { scale: 'xscale', field: 'bin0', offset: 10 },
            y: { scale: 'yscale', field: 'count', offset: -2 },
            text: {
              field: 'count'
            }
          }
        }
      }
    ]
  };
};

export default Histogram;
