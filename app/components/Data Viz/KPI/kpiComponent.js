import React from 'react';

import styles from './kpiComponent.css';

const KPIComponent = ({ title, primaryKPI, secondaryKPI }) => {
  return (
    <div className={styles.kpiContainer}>
      <div className={styles.kpiTitle}>{title}</div>
      <table className={styles.kpi}>
        <tr>
          <td className={styles.KPILabel}>{primaryKPI.label}</td>
          <td className={styles.KPIValue}>{primaryKPI.value}</td>
        </tr>
        {secondaryKPI ? (
          <tr>
            <td className={styles.KPILabel}>{secondaryKPI.label}</td>
            <td className={styles.KPIValue}>{secondaryKPI.value}</td>
          </tr>
        ) : null}
      </table>
    </div>
  );
};

export default KPIComponent;
