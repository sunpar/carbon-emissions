import React, { useRef, useContext, useState, useEffect } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import * as d3 from 'd3';
import { group } from 'd3-array';
import { ApplyPatches } from 'rxq/GenericObject';

import useObjectData from '../../../Qlik/Hooks/useObjectData';
import qlikContext from '../../../Context/qlikContext';
import flightCO2 from '../../../Qlik/Object-Props/flightCO2';
import { numberWithCommas } from '../../../utils/numberFunctions';
import TileComponent from '../tile/tile';
import Beeswarm from '../../Data Viz/Beeswarm';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

import styles from './beeswarm-tile.css';

const getRandom = (arr, n) => {
  if (arr.length <= n) {
    return arr;
  }
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available');
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};

const formatData = (data, valueNum, colorNum) => {
  return data
    .map(row => ({
      tooltips: [
        { label: 'Itinerary', value: row.Itinerary },
        { label: 'Departure Date', value: row.DeptDate },
        { label: 'Travel Class', value: row.Class },
        { label: 'Travel Category', value: row.Category },
        { label: 'Travel Type', value: row.Type },
        { label: 'Traveler Type', value: row.PersonType },
        { label: 'Carbon (kg)', value: row.Carbon },
        { label: 'Distance (km)', value: row.Distance },
        { label: '# Flights', value: row.Flights }
      ],
      selectValue: row.ItinSelect,
      value: valueNum === 0 ? row.Carbon : row.Distance,
      colorValue:
        colorNum === 0
          ? row.Carbon
          : colorNum === 1
          ? row.Distance
          : row.Flights
    }))
    .filter(row => row.value > 0);
};

const transformIntoChartData = (mappedData, valueNum, colorNum) => {
  const array = Array.from(mappedData).map(row => [
    row[0],
    formatData(row[1], valueNum, colorNum)
  ]);
  return array;
};

const BeeSwarmTile = () => {
  const { app$ } = useContext(qlikContext);
  const { handle, data, loading } = useObjectData(flightCO2, app$);
  const [chartNum, setChartNum] = useState(1);
  const [valueNum, setValueNum] = useState(0);
  const [colorNum, setColorNum] = useState(1);
  const isFirstRun = useRef(true);

  if (!loading && data) {
    const flatData = data.map((row, i) => {
      return {
        key: 'All',
        ItinSelect: row[1].qText,
        Itinerary: row[2].qText,
        DeptDate: row[3].qText,
        Class: row[4].qText,
        Category: row[5].qText,
        Type: row[6].qText,
        PersonType: row[7].qText,
        Carbon: row[8].qNum,
        Distance: row[9].qNum,
        Flights: row[10].qNum
      };
    });
    let property = 'key';
    switch (chartNum) {
      case 0:
        property = 'key';
        break;
      case 1:
        property = 'Class';
        break;
      case 2:
        property = 'PersonType';
        break;
      case 3:
        property = 'Category';
        break;
    }
    const nestedData = group(getRandom(flatData, 7000), d => d[property]);
    const chartData = transformIntoChartData(nestedData, valueNum, colorNum);

    // find extent of data
    const filteredData = [
      ...chartData.map(row => row[1].map(item => item.value))
    ].reduce((acc, val) => acc.concat(val), []);
    const extent = d3.extent(filteredData);

    const handleChange = name => event => {
      if (event.target.checked) {
        setValueNum(1);
      } else {
        setValueNum(0);
      }
    };

    const handleChangeTab = (event, newValue) => {
      setChartNum(newValue);
    };

    return (
      <TileComponent title="Distribution">
        <div className={styles.trendsContainer}>
          <div className={styles.tabContainer}>
            <Tabs value={chartNum} onChange={handleChangeTab}>
              <Tab label="Itineraries" />
              <Tab label="Class" />
              <Tab label="Traveler Type" />
              <Tab label="Travel Category" />
            </Tabs>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.colorButtons}>
              <div className={styles.colorLabel}>Color By:</div>
              <Button
                variant="outlined"
                color={colorNum === 0 ? 'primary' : null}
                onClick={() => setColorNum(0)}
              >
                Carbon (kg)
              </Button>
              <Button
                variant="outlined"
                color={colorNum === 1 ? 'primary' : null}
                onClick={() => setColorNum(1)}
              >
                Distance (km)
              </Button>
              <Button
                variant="outlined"
                color={colorNum === 2 ? 'primary' : null}
                onClick={() => setColorNum(2)}
              >
                # Flights
              </Button>
            </div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={valueNum > 0}
                    onChange={handleChange('valueNum')}
                    value="valueNum"
                  />
                }
                label={
                  valueNum > 0
                    ? 'Distribution by Distance (km)'
                    : 'Distribution by Carbon (kg)'
                }
              />
            </FormGroup>
            {chartData.map(chart => {
              return (
                <div key={chart[0]}>
                  <div className={styles.chartTitle}>Dim Value: {chart[0]}</div>
                  <Beeswarm
                    data={chart[1]}
                    extent={extent}
                    selField={'[%UN Travel Row ID]'}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </TileComponent>
    );
  }

  return <TileComponent title="Distribution" />;
};

export default BeeSwarmTile;
