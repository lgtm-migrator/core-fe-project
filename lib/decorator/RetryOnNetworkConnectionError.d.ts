/**
 * Re-execute the action if NetworkConnectionException is thrown.
 * A warning log will be also created, for each retry.
 */
export declare function RetryOnNetworkConnectionError(retryIntervalSecond?: number): (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<import("../module").ActionHandler>) => TypedPropertyDescriptor<import("../module").ActionHandler>;
//# sourceMappingURL=RetryOnNetworkConnectionError.d.ts.map