import { useState, useEffect } from "react";
import { switchMap, map } from "rxjs/operators";
import { GetAuthenticatedUser } from "rxq/Global";

const useUserName = global$ => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    const objSub = global$
      .pipe(
        switchMap(globalHandle => globalHandle.ask(GetAuthenticatedUser)),
        map(user => user.substring(user.lastIndexOf("=")+1))
      )
      .subscribe(user => setValue(user));
    return () => objSub.unsubscribe();
  }, []);

  return value;
};

export default useUserName;
