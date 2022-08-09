/**
 * If specified, the action cannot be entered by other sagas during execution.
 * For error handler action, mutex logic is auto added.
 */
export declare function Mutex(): (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<import("../module").ActionHandler>) => TypedPropertyDescriptor<import("../module").ActionHandler>;
//# sourceMappingURL=Mutex.d.ts.map