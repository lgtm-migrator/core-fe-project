import React from "react";
import { IdleState } from "../reducer";
export declare const DEFAULT_IDLE_TIMEOUT = 300;
interface Props {
    children: React.ReactNode;
}
export declare const IdleDetectorContext: React.Context<IdleState>;
export declare function IdleDetector(props: Props): JSX.Element;
export {};
//# sourceMappingURL=IdleDetector.d.ts.map