import { useState, useEffect } from "react";
import { startWith, switchMap, retry, tap } from "rxjs/operators";
import { GetLayout } from "rxq/GenericObject";

const useLayout = objHandle => {
  const [value, setValue] = useState({ qInfo: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      Array.isArray(objHandle) &&
      !objHandle.some(handle => handle === null)
    ) {
      // array of object handles that are not null
      return;
    } else if (!Array.isArray(objHandle) && objHandle !== null) {
      // single obj handle that is not null
      const objSub = objHandle.invalidated$
        .pipe(
          startWith(objHandle),
          tap(() => setLoading(true)),
          switchMap(h => h.ask(GetLayout).pipe(retry(3))),
          tap(() => setLoading(false))
        )
        .subscribe(layout => setValue({ ...layout }));
      return () => objSub.unsubscribe();
    }
  }, [objHandle]);
  return [value, loading];
};

export default useLayout;
