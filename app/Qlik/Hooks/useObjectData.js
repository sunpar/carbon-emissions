import { useReducer, useEffect } from "react";
import { merge } from "rxjs";
import { qAsk, invalidations } from "rxq";
import { CreateSessionObject } from "rxq/Doc";
import { GetLayout, GetHyperCubeData } from "rxq/GenericObject";
import {
  retry,
  switchMap,
  tap,
  reduce,
  withLatestFrom,
  shareReplay
} from "rxjs/operators";

const reducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "DONE_LOADING":
      return { ...state, loading: false };
    case "SET_NEW_STATE":
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
};

const useGenericObjectData = (
  objProps,
  app$,
  page = { height: null, width: null }
) => {
  const [value, dispatch] = useReducer(reducer, {
    handle: null,
    layout: null,
    data: null,
    loading: false
  });

  useEffect(() => {
    const objLayout$ = app$.pipe(
      qAsk(CreateSessionObject, objProps),
      invalidations(true),
      switchMap(
        handle => handle.ask(GetLayout).pipe(retry(3)),
        (handle, layout) => [handle, layout]
      ),
      shareReplay(1)
    );

    const objData$ = objLayout$.pipe(
      switchMap(([h, layout]) => {
        const totalRows = layout.qHyperCube.qSize.qcy;
        let { width, height } = page;
        if (!width) {
          width =
            layout.qHyperCube.qDimensionInfo.length +
            layout.qHyperCube.qMeasureInfo.length;
        }
        if (!height) {
          height = Math.floor(10000 / width);
        }
        const pageCt = Math.ceil(totalRows / height);

        const pageRequests = new Array(pageCt).fill(undefined).map((m, i) =>
          h
            .ask(GetHyperCubeData, "/qHyperCubeDef", [
              {
                qTop: i * height,
                qLeft: 0,
                qWidth: width,
                qHeight: height
              }
            ])
            .pipe(retry(3))
        );

        return merge(...pageRequests).pipe(
          reduce((acc, curr) => acc.concat(curr))
        );
      })
    );

    const objSub = objData$
      .pipe(withLatestFrom(objLayout$))
      .subscribe(([data, [handle, layout]]) => {
        const flatData = data.reduce(
          (prev, curr) => prev.concat(curr.qMatrix),
          []
        );
        dispatch({
          type: "SET_NEW_STATE",
          payload: { data: flatData, handle, layout, loading: false }
        });
      });
    return () => objSub.unsubscribe();
  }, [objProps, app$, page.height, page.width]);

  return value;
};

export default useGenericObjectData;
