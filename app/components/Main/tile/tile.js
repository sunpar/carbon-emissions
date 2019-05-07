import React, { useRef } from "react";
import PropTypes from "prop-types";
import { ExportData } from "rxq/GenericObject";

import qlikConfig from "../../../Context/qlikConfig";
import TileHeaderComponent from "./tile-header/tile-header";

import styles from "./tile.css";


const exportDataToExcel = objHandle => {
  if (objHandle) {
    const export$ = objHandle.ask(ExportData, "OOXML", "", "", "P");
    export$.subscribe(val => {
      const link = "https://" + qlikConfig.host + val.qUrl;
      window.open(link);
    });
  }
};

const TileComponent = ({
  title,
  children,
  objHandle = false,
  print = false,
  onIndexChange,
  showIndexToggle = false,
}) => {
  const tileContainer = useRef(null);

  return (
    <div className={styles.tileContainer} ref={tileContainer}>
      {title !== undefined ? (
        <TileHeaderComponent
          title={title}
          onPrint={
            print ? () => false: false
          }
          onExport={objHandle ? () => exportDataToExcel(objHandle) : false}
          showIndexToggle={showIndexToggle}
          handleIndexChange={index => onIndexChange(index)}
        />
      ) : null}
      {children}
    </div>
  );
};

TileComponent.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  objHandle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  print: PropTypes.bool,
  onIndexChange: PropTypes.func
};

export default TileComponent;
