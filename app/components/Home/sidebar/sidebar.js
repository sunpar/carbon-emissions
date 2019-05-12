import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import FiberSmartRecord from '@material-ui/icons/FiberSmartRecord';
import Map from '@material-ui/icons/Map';
import BarChart from '@material-ui/icons/BarChart';

import UNLogo from '../../../_assets/UNLogo.gif';
import SideBarIcon from './sidebar-icon/sidebar-icon';
import Styles from './sidebar.css';

const SideBar = ({ history }) => {
  const ICON_STYLE = {
    color: '#FFFFFF',
    fontSize: '16px'
  };

  //The icons & icon text that we need in the side panel
  const icons = [
    <FiberSmartRecord style={ICON_STYLE} />,
    <BarChart style={ICON_STYLE} />,
    <Map style={ICON_STYLE} />,
  ];

  // Which icon is active?
  let [activeIcon, setActiveIcon] = useState(2);

  useEffect(
    () => {
      switch (activeIcon) {
        case 0:
          history.push('/main');
          break;
        case 1:
          history.push('/analysis');
          break;
        case 2:
          history.push('/map');
          break;
      }
      return;
    },
    [activeIcon]
  );

  return (
    <div className={Styles.sideBar}>
      <div className={Styles.logo} onClick={() => {}}>
        <img src={UNLogo} className={Styles.UNLogo} alt={'logo'} />
      </div>

      {icons.map((icon, i) => {
        return (
          <div
            className={Styles.sideItem}
            key={i}
            onClick={() => {
              setActiveIcon(i);
            }}
          >
            <SideBarIcon active={activeIcon === i}>{icon}</SideBarIcon>
          </div>
        );
      })}
    </div>
  );
};

SideBar.propTypes = {
  children: PropTypes.node,
  styles: PropTypes.object
};

export default withRouter(SideBar);
