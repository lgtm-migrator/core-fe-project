import { Location } from "history";
import { SagaGenerator } from "../typed-saga";
import { Logger } from "../Logger";
import { TickIntervalDecoratorFlag } from "../module";
import { State } from "../reducer";
export declare type ModuleLocation<State> = Location<Readonly<State> | undefined>;
export interface ModuleLifecycleListener<RouteParam extends object = object, HistoryState extends object = object> {
    onEnter: (entryComponentProps?: any) => SagaGenerator;
    onDestroy: () => SagaGenerator;
    onLocationMatched: (routeParameters: RouteParam, location: Location<Readonly<HistoryState> | undefined>) => SagaGenerator;
    onTick: (() => SagaGenerator) & TickIntervalDecoratorFlag;
}
export declare class Module<RootState extends State, ModuleName extends keyof RootState["app"] & string, RouteParam extends object = object, HistoryState extends object = object> implements ModuleLifecycleListener<RouteParam, HistoryState> {
    readonly name: ModuleName;
    readonly initialState: RootState["app"][ModuleName];
    constructor(name: ModuleName, initialState: RootState["app"][ModuleName]);
    onEnter(entryComponentProps: any): SagaGenerator;
    onDestroy(): SagaGenerator;
    onLocationMatched(routeParam: RouteParam, location: ModuleLocation<HistoryState>): SagaGenerator;
    onTick(): SagaGenerator;
    get state(): Readonly<RootState["app"][ModuleName]>;
    get rootState(): Readonly<RootState>;
    get logger(): Logger;
    setNavigationPrevented(isPrevented: boolean): void;
    setState<K extends keyof RootState["app"][ModuleName]>(stateOrUpdater: ((state: RootState["app"][ModuleName]) => void) | Pick<RootState["app"][ModuleName], K> | RootState["app"][ModuleName]): void;
    /**
     * CAVEAT:
     * (1)
     * Calling this.pushHistory to other module should cancel the following logic.
     * Using store.dispatch here will lead to error while cancelling in lifecycle.
     *
     * Because the whole process is in sync mode:
     * dispatch push action -> location change -> router component will un-mount -> lifecycle saga cancel
     *
     * Cancelling the current sync-running saga will throw "TypeError: Generator is already executing".
     *
     * (2)
     * Adding yield cancel() in pushHistory is also incorrect.
     * If this.pushHistory is only to change state rather than URL, it will lead to the whole lifecycle saga cancelled.
     *
     * https://github.com/react-boilerplate/react-boilerplate/issues/1281
     */
    pushHistory(url: string): SagaGenerator;
    pushHistory(url: string, stateMode: "keep-state"): SagaGenerator;
    pushHistory<T extends object>(url: string, state: T): SagaGenerator;
    pushHistory(state: HistoryState): SagaGenerator;
}
//# sourceMappingURL=Module.d.ts.map