import React, { useRef, useState, useLayoutEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';

import airportGEOProps from '../../../Qlik/Object-Props/AirportGEOJson';
import useObjectData from '../../../Qlik/Hooks/useObjectData';
import qlikContext from '../../../Context/qlikContext';

import configurePointLayer from './configurePointLayer';

import styles from './map.css';

const Map = ({ classes }) => {
  const mapEl = useRef(null);
  const [map, setMap] = useState(null);
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
          center: [5, 34],
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

  //   // get the airport coords & plot them
  const { data: objData } = useObjectData(airportGEOProps, app$);
  useLayoutEffect(
    () => {
      if (objData && map) {
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

  return <div className={styles.mapContainer} ref={mapEl} />;
};

export default Map;
