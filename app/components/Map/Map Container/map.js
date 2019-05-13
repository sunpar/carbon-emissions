import React, { useRef, useState, useLayoutEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { Range } from 'rc-slider';

import airportGEOProps from '../../../Qlik/Object-Props/AirportGEOJson';
import flightPathing from '../../../Qlik/Object-Props/flightPathing';
import useObjectData from '../../../Qlik/Hooks/useObjectData';
import qlikContext from '../../../Context/qlikContext';
import configurePointLayer from './configurePointLayer';
import styles from './map.css';
import * as turf from '@turf/turf';

const Map = ({ classes }) => {
  const mapEl = useRef(null);
  const [map, setMap] = useState(null);
  const [kmValue, setKMValue] = useState([0, 1000]);
  const { app$ } = useContext(qlikContext);
  useLayoutEffect(
    () => {
      if (mapEl.current) {
        // draw the map
        mapboxgl.accessToken =
          'pk.eyJ1Ijoic3VucGFyIiwiYSI6ImNqdWdlN3ZwNDBvMWU0NG1qdjQwcnJ2cjQifQ.q3nY8YdDK_Qk3YwDrLqEbA';

        const map = new mapboxgl.Map({
          container: mapEl.current,
          style: 'mapbox://styles/mapbox/navigation-guidance-day-v4',
          center: [20, 0],
          zoom: 1.5
        });

        setMap(map);

        return () => {
          map.remove();
        };
      }
      return;
    },
    [mapEl.current]
  );

  // get the airport coords & plot them
  const { data: objData } = useObjectData(airportGEOProps, app$);
  const { data: flightData } = useObjectData(flightPathing, app$);
  useLayoutEffect(
    () => {
      if (flightData && map) {
        const calculatedData = flightData
          .map(row => {
            const from = turf.point(JSON.parse(row[2].qText));
            const to = turf.point(JSON.parse(row[4].qText));
            const distance = turf.distance(from, to);
            return {
              Origin: row[1].qText,
              OriginJSON: JSON.parse(row[2].qText),
              Destination: row[3].qText,
              DestinationJSON: JSON.parse(row[4].qText),
              Distance: distance.toFixed(0)
            };
          })
          .filter(
            row => row.Distance < kmValue[1] && row.Distance > kmValue[0]
          );
        // console.log(calculatedData);
      }
    },
    [flightData, map, kmValue]
  );
  useLayoutEffect(
    () => {
      if (objData && map) {
        // console.log(objData);
        const data = objData.map(row => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: JSON.parse(row[1].qText)
          },
          properties: {
            airportName: row[0].qText,
            flights: row[2].qNum,
            co2perFlight: parseInt(row[3].qNum.toFixed(0))
          }
        }));
        const source = {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: data
          }
        };
        const mapSource = map.getSource('airportsGeo');
        if (mapSource) {
          mapSource.setData(source.data);
        } else {
          map.on('load', () => {
            map.addSource('airportsGeo', source);
            map.addLayer({
              id: 'airportPoints',
              type: 'circle',
              source: 'airportsGeo',
              paint: {
                'circle-color': [
                  'interpolate',
                  ['linear'],
                  ['get', 'co2perFlight'],
                  0,
                  '#44c8a7',
                  2000,
                  '#7F3121'
                ],
                'circle-opacity': 0.75,
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['get', 'flights'],
                  0,
                  4,
                  10000,
                  10
                ]
              }
            });
            configurePointLayer(map);
          });
        }
      }
      return;
    },
    [objData, map]
  );

  const handleSlider = value => {
    setKMValue(value);
  };

  return (
    <div className={styles.mapContainer} ref={mapEl}>
      <div className={styles.mapControls}>
        <div className={styles.range}>
          <Range
            min={0}
            max={17500}
            defaultValue={[0, 1000]}
            step={50}
            onChange={handleSlider}
          />
        </div>
        <div ClassName={styles.rangeLabel}>
          Range: {kmValue[0]}km to {kmValue[1]}km
        </div>
      </div>
    </div>
  );
};

export default Map;
