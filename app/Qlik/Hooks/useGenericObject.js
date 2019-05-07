import { useState, useEffect } from "react";
import { qAsk, invalidations } from "rxq";
import { CreateSessionObject } from "rxq/Doc";

const useGenericObject = (objProps, app$) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const objSub = app$
      .pipe(
        qAsk(CreateSessionObject, objProps),
        invalidations(true)
      )
      .subscribe(handle => setValue(handle));
    return () => objSub.unsubscribe();
  }, []);

  return value;
};

export default useGenericObject;
