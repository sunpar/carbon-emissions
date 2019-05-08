import React from 'react';
import PropTypes from 'prop-types';

import QlikFilterComponent from '../../Qlik/filter/qlikFilter';
import styles from './filterRow.css';

const filters = [
  { display: 'Year', field: '[Departure Date.autoCalendar.Year]' },
  { display: 'Month', field: '[Departure Date.autoCalendar.Month]' },
  { display: 'Week', field: '[Departure Date.autoCalendar.Week]' }
];

const filters2 = [
  { display: 'Class', field: 'Class' },
  { display: 'TPO', field: '[Travel Processing Office]' },
  { display: 'Traveler Type', field: '[Traveler Type]' },
  { display: 'Persnl Subarea', field: '[Personnel Subarea]' },
  { display: 'Travel Type', field: '[Travel Type]' },
  { display: 'Travel Category', field: '[Travel Category]' },
  { display: 'Origin City', field: '[Origin.City]' },
  { display: 'Destination City', field: '[Destination.City]' }
];

const FilterRowContainer = () => {
  return (
    <div className={styles.rowContainer}>
      <div className={styles.filterGroup}>
        {filters.map((filter, i) => {
          return (
            <div className={styles.filterContainer} key={i}>
              <QlikFilterComponent
                fieldName={filter.field}
                displayName={filter.display}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.filterGroup}>
        {filters2.map((filter, i) => {
          return (
            <div className={styles.filterContainer} key={i}>
              <QlikFilterComponent
                fieldName={filter.field}
                displayName={filter.display}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

FilterRowContainer.propTypes = {
  children: PropTypes.node,
  styles: PropTypes.object
};

export default FilterRowContainer;
