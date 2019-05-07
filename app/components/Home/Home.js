// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import routes from '../../constants/routes';
import styles from './Home.css';

import SideBar from './sidebar';
import PageTitleComponent from './page-title/page-title';
import FilterRowComponent from './filter-row/filterRow';

import MapPage from '../../containers/MapPage';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <SideBar />
        <div className={styles.contentContainer}>
          <div className={styles.headerContainer}>
            <PageTitleComponent />
            <FilterRowComponent />
          </div>
          <div className={styles.mainContainer}>
            <Switch>
              <Route path={routes.MAP} component={MapPage} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
