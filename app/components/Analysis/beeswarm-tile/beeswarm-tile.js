import React, { useRef, useContext, useState, useEffect } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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

const BeeSwarmTile = () => {
  const { app$ } = useContext(qlikContext);
  const { handle, data, loading } = useObjectData(flightCO2, app$);
  const [chartNum, setChartNum] = useState(0);
  const [valueNum, setValueNum] = useState(0);
  const [colorNum, setColorNum] = useState(1);
  const isFirstRun = useRef(true);

  useEffect(
    () => {
      if (handle && isFirstRun.current) {
        isFirstRun.current = false;
      }
      if (handle && !isFirstRun.current) {
        let newDim = '=1';
        switch (chartNum) {
          case 0:
            newDim = '=1';
            break;
          case 1:
            newDim = '[Class]';
            break;
          case 2:
            newDim = '[Traveler Type]';
            break;
          case 3:
            newDim = '[Travel Category]';
            break;
          case 4:
            newDim = '[TPO]';
            break;
        }
        console.log('patching', newDim);
        const sub = handle
          .ask(ApplyPatches, [
            {
              qOp: 'replace',
              qPath: '/qHyperCubeDef/qDimensions/0/qDef/qFieldDefs/0',
              qValue: JSON.stringify(newDim)
            }
          ])
          .subscribe();
        return () => sub.unsubscribe();
      }
    },
    [chartNum, handle]
  );
  console.log(data);
  if (!loading && data) {
    const formatData = data
      .map(row => ({
        tooltips: [
          { label: 'Itinerary', value: row[2].qText },
          { label: 'Departure Date', value: row[3].qText },
          { label: 'Travel Class', value: row[4].qText },
          { label: 'Travel Category', value: row[5].qText },
          { label: 'Travel Type', value: row[6].qText },
          { label: 'Traveler Type', value: row[7].qText },
          { label: 'Carbon (kg)', value: row[8].qNum },
          { label: 'Distance (km)', value: row[9].qNum },
          { label: '# Flights', value: row[10].qNum }
        ],
        value: [row[8].qNum, row[9].qNum][valueNum],
        colorValue: [row[8].qNum, row[9].qNum, row[10].qNum][colorNum]
      }))
      .filter(row => row.value > 0)
      .slice(0, 1000);

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
              <Tab label="TPO" />
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
            <Beeswarm data={formatData} />
          </div>
        </div>
      </TileComponent>
    );
  }

  return <TileComponent title="Distribution" />;
};

export default BeeSwarmTile;
