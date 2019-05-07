import { useState, useEffect } from "react";
import { qAsk, invalidations } from "rxq";
import { CreateSessionObject } from "rxq/Doc";
import { GetLayout } from "rxq/GenericVariable";
import { retry, switchMap, tap } from "rxjs/operators";

const useGenericObjectLayout = (objProps, app$) => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const objSub = app$
      .pipe(
        qAsk(CreateSessionObject, objProps),
        invalidations(true),
        tap(() => setLoading(true)),
        switchMap(handle => handle.ask(GetLayout).pipe(retry(3))),
        tap(() => setLoading(true))
      )
      .subscribe(layout => setValue({ ...layout }));
    return () => objSub.unsubscribe();
  }, []);

  return [value, loading];
};

export default useGenericObjectLayout;
