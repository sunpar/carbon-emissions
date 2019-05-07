import React from "react";
import { connectSession, qAsk } from "rxq";
import { OpenDoc } from "rxq/Global";
import { shareReplay } from "rxjs/operators";
import qlikConfig from "./qlikConfig";

const session = connectSession(qlikConfig);

const global$ = session.global$.pipe(shareReplay(1));

const app$ = global$.pipe(
  qAsk(OpenDoc, "Qonnections Hackathon.qvf"),
  shareReplay(1)
);
const QlikContext = React.createContext({ session, global$, app$ });
export default QlikContext;
