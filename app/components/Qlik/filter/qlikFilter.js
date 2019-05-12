import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useLayoutEffect
} from 'react';
import PropTypes from 'prop-types';

import {
  SelectListObjectValues,
  ClearSelections,
  SelectListObjectExcluded
} from 'rxq/GenericObject';
import { map, filter, debounceTime, switchMap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

import QlikContext from '../../../Context/qlikContext';
import useListBox from '../../../Qlik/Hooks/useListBox';
import useLayout from '../../../Qlik/Hooks/useLayout';

import checkbox_checked from '../../../_assets/checkbox_checked.png';
import checkbox_unchecked from '../../../_assets/checkbox_unchecked.png';

import styles from './qlikFilter.css';

const QlikFilterComponent = ({
  fieldName,
  displayName,
  charLimit = 50,
  hideValues = []
}) => {
  // get listbox layout and handle
  const context = useContext(QlikContext);
  const LB_Handle = useListBox(fieldName, context.app$);
  const [layout, layoutLoading] = useLayout(LB_Handle);
  const containerEl = useRef(null);
  const [open, setOpen] = useState(false);
  // Get a stream of clicks in document
  // If element clicked isn't ref element or anything inside ref, set open to false
  useEffect(
    () => {
      if (containerEl.current !== null) {
        const clickSub = fromEvent(document.querySelector('body'), 'click')
          .pipe(
            filter(click => {
              return !containerEl.current.contains(click.target);
            })
          )
          .subscribe(() => setOpen(false));
        return () => clickSub.unsubscribe();
      }
      return;
    },
    [containerEl.current]
  );

  // Get a stream of clicks in the filter list
  // throttle so clicks don't arrive faster than 1 second
  // make selections based on click
  useLayoutEffect(
    () => {
      if (containerEl.current !== null) {
        const clickSub = fromEvent(containerEl.current, 'click')
          .pipe(
            debounceTime(300),
            filter(evt => evt.target.hasAttribute('data-qno')),
            map(evt => parseInt(evt.target.getAttribute('data-qno'))),
            switchMap(qno => {
              if (qno === -10) {
                return LB_Handle.ask(ClearSelections, '/qListObjectDef');
              } else if (qno === -11) {
                return LB_Handle.ask(
                  SelectListObjectExcluded,
                  '/qListObjectDef'
                );
              }
              return LB_Handle.ask(
                SelectListObjectValues,
                '/qListObjectDef',
                [qno],
                true
              );
            })
          )
          .subscribe();
        return () => clickSub.unsubscribe();
      }
      return;
    },
    [containerEl.current, LB_Handle]
  );

  //render only when layout is returned from qlik
  if (layout.qInfo !== null) {
    // get lisbox value info
    const allValues = layout.qListObject.qDataPages[0].qMatrix;
    const selected = allValues.filter(item => item[0].qState === 'S');
    const optional = allValues.filter(item => item[0].qState === 'O');
    const other = allValues.filter(
      item => item[0].qState !== 'S' && item[0].qState !== 'O'
    );

    const values = selected.concat(optional).concat(other);

    //find the currently selected values
    const selectedValues = values
      .map(value => value[0])
      .filter(value => value.qState === 'S');

    //build the display from the selected values
    let display = displayName,
      hasSelection = null;
    if (selectedValues.length === 0) {
      display = `${display}`;
    } else {
      hasSelection = styles.selected;
      display = display + ': ';
      selectedValues.forEach((value, i) => {
        display = display + value.qText;
        if (i < selectedValues.length - 1) {
          display = display + ', ';
        }
      });
      // if we're over the character limit, just put the # of selections
      if (display.length > charLimit) {
        display = `${displayName} (${selectedValues.length}/${values.length})`;
      }
    }

    // should box be highlighted for drop down?
    const boxOpenStyle = open ? styles.openBox : null;

    // the other symbols
    const checkedBox = qElem => (
      <img
        className={styles.checkBox}
        src={checkbox_checked}
        alt="clear selections"
        data-qno={qElem}
      />
    );
    const uncheckedBox = qElem => (
      <img
        className={styles.checkBox}
        src={checkbox_unchecked}
        alt="clear selections"
        data-qno={qElem}
      />
    );

    return (
      <div className={styles.container} ref={containerEl}>
        <div
          className={`${styles.filterBox} ${hasSelection} ${boxOpenStyle}`}
          onClick={() => setOpen(!open)}
        >
          <span className={styles.fieldName}>{display}</span>
        </div>
        {open ? (
          <div
            className={`${styles.ulContainer} ${
              layoutLoading ? styles.loading : null
            }`}
          >
            <div className={styles.listContainer}>
              <div className={styles.clearText} data-qno={-10}>
                Clear Selections
              </div>
              <div className={styles.clearText} data-qno={-11}>
                Select Excluded
              </div>
              <ul className={styles.list}>
                {values.map(item => {
                  if (
                    !item[0].qText ||
                    item[0].qText === 'NA' ||
                    hideValues.indexOf(item[0].qText) !== -1
                  )
                    return null;
                  return (
                    <li
                      key={item[0].qElemNumber}
                      className={`${styles.listItem} ${
                        item[0].qState === 'X' ? styles.excludedItem : null
                      }`}
                      data-qno={item[0].qElemNumber}
                    >
                      {item[0].qState === 'S'
                        ? checkedBox(item[0].qElemNumber)
                        : uncheckedBox(item[0].qElemNumber)}
                      {item[0].qText}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    );
  } else {
    return <div className={styles.container} ref={containerEl} />;
  }
};

QlikFilterComponent.propTypes = {
  fieldName: PropTypes.string
};

export default QlikFilterComponent;
