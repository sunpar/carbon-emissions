import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import QlikContext from "../../../Context/qlikContext";

import styles from './page-title.css';

const PageTitleComponent = ({ classes, segCode }) => {
  const { app$ } = useContext(QlikContext);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={styles.mainTitle}>Carbon Emissions</div>
      </div>
      
    </div>
  );
};

PageTitleComponent.propTypes = {
  children: PropTypes.node,
  styles: PropTypes.object,
  handler: PropTypes.func
};

export default PageTitleComponent;
