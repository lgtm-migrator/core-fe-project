import { ActionHandler, TickIntervalDecoratorFlag } from "../module";
declare type OnTickHandlerDecorator = (target: object, propertyKey: "onTick", descriptor: TypedPropertyDescriptor<ActionHandler & TickIntervalDecoratorFlag>) => TypedPropertyDescriptor<ActionHandler>;
/**
 * For *onTick() action only, to specify to tick interval in second.
 */
export declare function Interval(second: number): OnTickHandlerDecorator;
export {};
//# sourceMappingURL=Interval.d.ts.map