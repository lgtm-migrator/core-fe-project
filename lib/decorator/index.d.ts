import { ActionHandler } from "../module";
import { Module } from "../platform/Module";
import { SagaGenerator } from "../typed-saga";
import { State } from "../reducer";
export { Interval } from "./Interval";
export { Loading } from "./Loading";
export { Log } from "./Log";
export { Mutex } from "./Mutex";
export { RetryOnNetworkConnectionError } from "./RetryOnNetworkConnectionError";
export { SilentOnNetworkConnectionError } from "./SilentOnNetworkConnectionError";
/**
 * Decorator type declaration, required by TypeScript.
 */
declare type HandlerDecorator = (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<ActionHandler>) => TypedPropertyDescriptor<ActionHandler>;
declare type ActionHandlerWithMetaData = ActionHandler & {
    actionName: string;
    maskedParams: string;
};
declare type HandlerInterceptor<RootState extends State = State> = (handler: ActionHandlerWithMetaData, thisModule: Module<RootState, any>) => SagaGenerator;
/**
 * A helper for ActionHandler functions (Saga).
 */
export declare function createActionHandlerDecorator<RootState extends State = State>(interceptor: HandlerInterceptor<RootState>): HandlerDecorator;
//# sourceMappingURL=index.d.ts.map