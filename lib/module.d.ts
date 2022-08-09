import { Exception } from "./Exception";
import { Module, ModuleLifecycleListener } from "./platform/Module";
import { ModuleProxy } from "./platform/ModuleProxy";
import { Action } from "./reducer";
import { SagaGenerator } from "./typed-saga";
export interface TickIntervalDecoratorFlag {
    tickInterval?: number;
}
export declare type ActionHandler = (...args: any[]) => SagaGenerator;
export declare type ErrorHandler = (error: Exception) => SagaGenerator;
export interface ErrorListener {
    onError: ErrorHandler;
}
declare type ActionCreator<H> = H extends (...args: infer P) => SagaGenerator ? (...args: P) => Action<P> : never;
declare type HandlerKeys<H> = {
    [K in keyof H]: H[K] extends (...args: any[]) => SagaGenerator ? K : never;
}[Exclude<keyof H, keyof ModuleLifecycleListener | keyof ErrorListener>];
export declare type ActionCreators<H> = {
    readonly [K in HandlerKeys<H>]: ActionCreator<H[K]>;
};
export declare function register<M extends Module<any, any>>(module: M): ModuleProxy<M>;
export declare function executeAction(actionName: string, handler: ActionHandler, ...payload: any[]): SagaGenerator;
export {};
//# sourceMappingURL=module.d.ts.map