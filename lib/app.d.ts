import { History } from "history";
import { Store } from "redux";
import { SagaMiddleware } from "redux-saga";
import { Logger, LoggerConfig, LoggerImpl } from "./Logger";
import { ActionHandler, ErrorHandler } from "./module";
import { State } from "./reducer";
interface App {
    readonly browserHistory: History;
    readonly store: Store<State>;
    readonly sagaMiddleware: SagaMiddleware<any>;
    readonly actionHandlers: {
        [actionType: string]: ActionHandler;
    };
    readonly logger: LoggerImpl;
    loggerConfig: LoggerConfig | null;
    errorHandler: ErrorHandler;
}
export declare const app: App;
export declare const logger: Logger;
export {};
//# sourceMappingURL=app.d.ts.map