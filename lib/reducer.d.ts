import { RouterState } from "connected-react-router";
import { Action as ReduxAction, Reducer } from "redux";
import type { History } from "history";
interface LoadingState {
    [loading: string]: number;
}
export interface IdleState {
    timeout: number;
    state: "active" | "idle";
}
export interface State {
    loading: LoadingState;
    router: RouterState;
    navigationPrevented: boolean;
    app: object;
    idle: IdleState;
}
declare const SET_STATE_ACTION = "@@framework/setState";
export interface Action<P> extends ReduxAction<string> {
    payload: P;
    name?: typeof SET_STATE_ACTION;
}
interface SetStateActionPayload {
    module: string;
    state: any;
}
export declare function setStateAction(module: string, state: object, type: string): Action<SetStateActionPayload>;
interface LoadingActionPayload {
    identifier: string;
    show: boolean;
}
export declare const LOADING_ACTION = "@@framework/loading";
export declare function loadingAction(show: boolean, identifier?: string): Action<LoadingActionPayload>;
interface NavigationPreventionActionPayload {
    isPrevented: boolean;
}
export declare function navigationPreventionAction(isPrevented: boolean): Action<NavigationPreventionActionPayload>;
interface IdleStateActionPayload {
    state: "active" | "idle";
}
export declare const IDLE_STATE_ACTION = "@@framework/idle-state";
export declare function idleStateActions(state: "active" | "idle"): Action<IdleStateActionPayload>;
interface IdleTimeoutActionPayload {
    timeout: IdleState["timeout"];
}
export declare function idleTimeoutActions(timeout: number): Action<IdleTimeoutActionPayload>;
export declare function idleReducer(state: IdleState | undefined, action: Action<IdleStateActionPayload | IdleTimeoutActionPayload>): IdleState;
export declare function rootReducer(history: History): Reducer<State>;
export declare function showLoading(state: State, identifier?: string): boolean;
export {};
//# sourceMappingURL=reducer.d.ts.map