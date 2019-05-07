import React from 'react';
import PropTypes from 'prop-types';
import styles from './sidebar-icon.css';

const SideBarIcon = ({ classes, children, onClick, active }) => {
  return (
    <div
      className={`${styles.icon} ${active ? styles.iconActive : null}`}
      onClick={onClick}
    >
      <div className={styles.iconWrapper}>{children}</div>
    </div>
  );
};

SideBarIcon.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
  bkgColor: PropTypes.string,
  bkgImageWrapper: PropTypes.string,
  active: PropTypes.bool,
  solid: PropTypes.bool,
  sizeWrapper: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  }),
  onClick: PropTypes.func
};

export default SideBarIcon;
