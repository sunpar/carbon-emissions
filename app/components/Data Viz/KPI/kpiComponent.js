import React, { useRef } from 'react';
import PartWholeBar from '../Part of Whole Bar';
import SparkLine from '../Sparkline';
import styles from './kpiComponent.css';
import useElementSize from '../../../Hooks/useElementSize';

const KPIComponent = ({
  title,
  primaryKPI,
  secondaryKPI,
  thirdKPI,
  sparkData
}) => {
  const chartDiv = useRef(null);
  const { width } = useElementSize(chartDiv);
  const percent = secondaryKPI.number / primaryKPI.number;
  return (
    <div className={styles.kpiContainer}>
      <div className={styles.kpiTitle}>{title}</div>
      <table className={styles.kpi}>
        <tbody>
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
        </tbody>
      </table>
      <div className={styles.barChart} ref={chartDiv}>
        {secondaryKPI ? (
          <>
            <svg className={styles.chartSVG}>
              <PartWholeBar percent={percent} width={width} />
            </svg>
          </>
        ) : (
          <SparkLine data={sparkData} />
        )}
        <table className={styles.kpi}>
          <tbody>
            {thirdKPI ? (
              <tr>
                <td className={styles.KPILabel}>{thirdKPI.label}</td>
                <td className={styles.KPIValue}>{thirdKPI.value}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KPIComponent;
