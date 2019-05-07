import { useReducer, useEffect } from "react";
import { qAsk, invalidations } from "rxq";
import { CreateSessionObject } from "rxq/Doc";
import { GetLayout } from "rxq/GenericVariable";
import { retry, switchMap, tap } from "rxjs/operators";

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

const useGenericObjectData = (objProps, app$) => {
  const [value, dispatch] = useReducer(reducer, {
    handle: null,
    layout: null,
    loading: false
  });

  useEffect(() => {
    const objSub = app$
      .pipe(
        qAsk(CreateSessionObject, objProps),
        invalidations(true),
        tap(handle =>
          dispatch({
            type: "SET_NEW_STATE",
            payload: { handle, loading: true }
          })
        ),
        switchMap(handle => handle.ask(GetLayout).pipe(retry(3)))
      )
      .subscribe(layout =>
        dispatch({
          type: "SET_NEW_STATE",
          payload: { layout, loading: false }
        })
      );
    return () => objSub.unsubscribe();
  }, [objProps, app$]);

  return value;
};

export default useGenericObjectData;