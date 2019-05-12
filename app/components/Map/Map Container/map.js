import React, { useRef, useState, useLayoutEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import ReactMapGL from 'react-map-gl';

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
    width: 1000,
    height: 1000,
    center: [5, 34],
    zoom: 1.5
  });
  const { app$ } = useContext(qlikContext);
  const { data: objData } = useObjectData(airportGEOProps, app$);
  return (
    <ReactMapGL
      {...viewPort}
      mapboxApiAccessToken={
        'pk.eyJ1Ijoic3VucGFyIiwiYSI6ImNqdWdlN3ZwNDBvMWU0NG1qdjQwcnJ2cjQifQ.q3nY8YdDK_Qk3YwDrLqEbA'
      }
      onViewportChange={viewport => setViewPort(viewPort)}
    />
  );
};

export default Map;
