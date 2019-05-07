import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import MapPage from './containers/MapPage';
import CounterPage from './containers/CounterPage';

export default () => (
  <App>
    <HomePage />
  </App>
);
