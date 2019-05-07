import { useState, useEffect } from "react";
import { CreateSessionObject } from "rxq/Doc";
import { qAsk } from "rxq";

const useListBox = (fieldName, app$) => {
  const [value, setValue] = useState(null);

  const listBoxProps = {
    qInfo: {
      qType: "listBox"
    },
    qListObjectDef: {
      qDef: {
        qFieldDefs: [`${fieldName}`]
      },
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qWidth: 1,
          qHeight: 10000
        }
      ]
    }
  };

  useEffect(() => {
    const objSub = app$
      .pipe(qAsk(CreateSessionObject, listBoxProps))
      .subscribe(objHandle => setValue(objHandle));
    return () => objSub.unsubscribe();
  }, [fieldName]);

  return value;
};

export default useListBox;
