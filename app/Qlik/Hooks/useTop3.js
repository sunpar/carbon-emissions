import { useState, useEffect } from "react";
import { pluck, map, retry, switchMap } from "rxjs/operators";
import { CreateSessionObject } from "rxq/Doc";
import { GetLayout } from "rxq/GenericVariable";
import { invalidations, qAskReplay } from "rxq";

const topObj = {
  qInfo: {
    qType: "customObj"
  },
  qHyperCubeDef: {
    qInitialDataFetch: [
      {
        qHeight: 3,
        qWidth: 4
      }
    ],
    qDimensions: [
      {
        qDef: {
          qFieldDefs: []
        },
        qTotalLabel: {},
        qCalcCond: {},
        qAttributeExpressions: [],
        qAttributeDimensions: [],
        qCalcCondition: {
          qCond: {},
          qMsg: {}
        },
        qNullSuppression: true
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef:
            "=(sum([Segment Pvs])/Sum(TOTAL [Segment Pvs]))/(sum([Network Pvs])/Sum(TOTAL [Network Pvs]))"
        },
        qLabel: "Max",
        qLibraryId: null,
        qSortBy: {
          qSortByState: 0,
          qSortByFrequency: 0,
          qSortByNumeric: -1,
          qSortByAscii: 0,
          qSortByLoadOrder: 0,
          qSortByExpression: 0,
          qExpression: {
            qv: " "
          }
        }
      }
    ],
    qInterColumnSortOrder: [1, 0],
    qSuppressZero: false,
    qSuppressMissing: false,
    qMode: "S"
  }
};

const useTop3 = (field, app$) => {
  const objProps = JSON.parse(JSON.stringify(topObj));

  if (typeof field === "object") {
    let dimArray = [];
    field.forEach(dim => {
      let newObj = JSON.parse(
        JSON.stringify(objProps.qHyperCubeDef.qDimensions[0])
      );
      newObj.qDef.qFieldDefs = [`${dim}`];
      dimArray.push(newObj);
    });
    objProps.qHyperCubeDef.qDimensions = dimArray;
    objProps.qHyperCubeDef.qInterColumnSortOrder = [3, 2, 1, 0];
  } else {
    objProps.qHyperCubeDef.qDimensions[0].qDef.qFieldDefs = [`${field}`];
  }

  if (field === "Segment Name") {
    objProps.qHyperCubeDef.qMeasures[0].qDef.qDef =
      "=(Sum([Intersect Pvs])/Sum(TOTAL [Segment Pvs]))/(sum([Intersect Total Pvs])/Sum(TOTAL [Network Pvs]))";
  } else if (typeof field === "object") {
    objProps.qHyperCubeDef.qMeasures[0].qDef.qDef =
      "=(sum({<[gender]-={'NA'}, [age]-={'NA'}, [income]-={'NA'}>}[Segment Pvs])/Sum(TOTAL [Segment Pvs]))/(sum({<[gender]-={'NA'}, [age]-={'NA'}, [income]-={'NA'}>}[Network Pvs])/Sum(TOTAL [Network Pvs]))";
  } else {
    objProps.qHyperCubeDef.qMeasures[0].qDef.qDef = `=(sum({<${field}-={'NA', 'Unknown'}>}[Segment Pvs])/Sum(TOTAL [Segment Pvs]))/(sum({<${field}-={'NA', 'Unknown'}>}[Network Pvs])/Sum(TOTAL [Network Pvs]))`;
  }

  const [top3, setTop3] = useState([]);

  useEffect(() => {
    const obj$ = app$.pipe(
      qAskReplay(CreateSessionObject, objProps),
      invalidations(true)
      // tap(() => setTop3([]))
    );
    const objSub = obj$
      .pipe(
        switchMap(handle => handle.ask(GetLayout).pipe(retry(3))),
        pluck("qHyperCube", "qDataPages", 0, "qMatrix"),
        map(matrix => {
          if (typeof field === "object") {
            return matrix.map(
              row => `${row[0].qText}, ${row[1].qText}, ${row[2].qText}`
            );
          } else {
            return matrix.map(row => row[0].qText);
          }
        })
      )
      .subscribe(result => setTop3(result));
    return () => objSub.unsubscribe();
  }, field);

  return top3;
};

export default useTop3;
