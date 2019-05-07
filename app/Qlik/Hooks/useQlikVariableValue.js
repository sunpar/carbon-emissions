import { useState, useEffect } from 'react';
import { switchMap } from 'rxjs/operators';
import { GetVariableByName } from 'rxq/Doc';
import { GetLayout } from 'rxq/GenericVariable';

const useQlikVariableValue = (varName, app$) => {

    const [value, setValue] = useState('Temp Var Name');

    useEffect(() => {
        const varSub = app$.pipe(
            switchMap(h => h.ask(GetVariableByName, varName)),
            switchMap(h => h.ask(GetLayout))
        )
        .subscribe(layout => setValue({qText: layout.qText, qNum: layout.qNum}))
        return () => varSub.unsubscribe();
    })


    return value;
}

export default useQlikVariableValue;