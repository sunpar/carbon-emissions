import { useState, useEffect } from "react";
import { switchMap, startWith, pluck } from "rxjs/operators";
import { CreateSessionObject } from "rxq/Doc";
import { GetLayout } from "rxq/GenericVariable";

const useValueExpression = (expr, app$) => {
  const objProps = {
    qInfo: {
      qType: "expr-obj"
    },
    myValue: {
      qValueExpression: `${expr}`
    }
  };
  const [value, setValue] = useState(null);

  useEffect(() => {
    const objSub = app$
      .pipe(
        switchMap(h => h.ask(CreateSessionObject, objProps)),
        switchMap(h => h.invalidated$.pipe(startWith(h))),
        // tap(() => setValue(null)),
        switchMap(h => h.ask(GetLayout)),
        pluck("myValue")
      )
      .subscribe(layout => setValue(layout));
    return () => objSub.unsubscribe();
  }, []);

  return value;
};

export default useValueExpression;
