import { StrictEffect, Effect, spawn, delay, put } from "redux-saga/effects";
declare type SagaGeneratorWithReturn<RT> = Generator<Effect, RT, any>;
declare type UnwrapReturnType<R> = R extends SagaGeneratorWithReturn<infer RT> ? RT : R extends Promise<infer PromiseValue> ? PromiseValue : R;
export declare type SagaGenerator = Generator<StrictEffect>;
export declare function call<Args extends any[], R>(fn: (...args: Args) => R, ...args: Args): SagaGeneratorWithReturn<UnwrapReturnType<R>>;
export declare function race<T extends Record<string, unknown>>(effects: T): SagaGeneratorWithReturn<{
    [P in keyof T]?: UnwrapReturnType<T[P]>;
}>;
export declare function race<T1, T2>(effects: [T1, T2]): SagaGeneratorWithReturn<[UnwrapReturnType<T1>?, UnwrapReturnType<T2>?]>;
export declare function race<T1, T2, T3>(effects: [T1, T2, T3]): SagaGeneratorWithReturn<[UnwrapReturnType<T1>?, UnwrapReturnType<T2>?, UnwrapReturnType<T3>?]>;
export declare function race<T1, T2, T3, T4>(effects: [T1, T2, T3, T4]): SagaGeneratorWithReturn<[UnwrapReturnType<T1>?, UnwrapReturnType<T2>?, UnwrapReturnType<T3>?, UnwrapReturnType<T4>?]>;
export declare function race<T1, T2, T3, T4, T5>(effects: [T1, T2, T3, T4, T5]): SagaGeneratorWithReturn<[UnwrapReturnType<T1>?, UnwrapReturnType<T2>?, UnwrapReturnType<T3>?, UnwrapReturnType<T4>?, UnwrapReturnType<T5>?]>;
export declare function race<T>(effects: T[]): SagaGeneratorWithReturn<Array<UnwrapReturnType<T> | undefined>>;
export declare function all<T extends Record<string, unknown>>(effects: T): SagaGeneratorWithReturn<{
    [P in keyof T]: UnwrapReturnType<T[P]>;
}>;
export declare function all<T1, T2>(effects: [T1, T2]): SagaGeneratorWithReturn<[UnwrapReturnType<T1>, UnwrapReturnType<T2>]>;
export declare function all<T1, T2, T3>(effects: [T1, T2, T3]): SagaGeneratorWithReturn<[UnwrapReturnType<T1>, UnwrapReturnType<T2>, UnwrapReturnType<T3>]>;
export declare function all<T1, T2, T3, T4>(effects: [T1, T2, T3, T4]): SagaGeneratorWithReturn<[UnwrapReturnType<T1>, UnwrapReturnType<T2>, UnwrapReturnType<T3>, UnwrapReturnType<T4>]>;
export declare function all<T1, T2, T3, T4, T5>(effects: [T1, T2, T3, T4, T5]): SagaGeneratorWithReturn<[UnwrapReturnType<T1>, UnwrapReturnType<T2>, UnwrapReturnType<T3>, UnwrapReturnType<T4>, UnwrapReturnType<T5>]>;
export declare function all<T>(effects: T[]): SagaGeneratorWithReturn<Array<UnwrapReturnType<T>>>;
export { spawn, delay, put };
//# sourceMappingURL=typed-saga.d.ts.map