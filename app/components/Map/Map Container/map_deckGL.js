import React, { useRef, useState, useLayoutEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';

import airportGEOProps from '../../../Qlik/Object-Props/AirportGEOJson';
import useObjectData from '../../../Qlik/Hooks/useObjectData';
import qlikContext from '../../../Context/qlikContext';

import configurePointLayer from './configurePointLayer';

import styles from './map.css';

const TOKEN =
  'pk.eyJ1Ijoic3VucGFyIiwiYSI6ImNqdWdlN3ZwNDBvMWU0NG1qdjQwcnJ2cjQifQ.q3nY8YdDK_Qk3YwDrLqEbA';

const Map = ({ classes }) => {
  const mapEl = useRef(null);
  const [viewPort, setViewPort] = useState({
    longitude: 34,
    latitude: 5,
    zoom: 1.5,
    pitch: 0,
    bearing: 0
  });
  const { app$ } = useContext(qlikContext);
  const { data } = useObjectData(airportGEOProps, app$);
  if (data) {
    const geoJSONData = data.map(row => ({
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
    const layer = new GeoJsonLayer({
      id: 'geojson-layer',
      data: geoJSONData
    });
    return (
      <DeckGL initialViewState={viewPort} controller={true} layers={[layer]}>
        <StaticMap mapboxApiAccessToken={TOKEN} />
      </DeckGL>
    );
  }

  return null;
};

export default Map;
