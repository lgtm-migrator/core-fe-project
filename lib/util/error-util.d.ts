import { Exception } from "../Exception";
import { ErrorHandler } from "../module";
interface ErrorExtra {
    actionPayload?: string;
    extraStacktrace?: string;
}
export declare function errorToException(error: unknown): Exception;
export declare function captureError(error: unknown, action: string, extra?: ErrorExtra): Exception;
export declare function runUserErrorHandler(handler: ErrorHandler, exception: Exception): Generator<import("redux-saga/effects").StrictEffect<any, any>, void, unknown>;
export {};
//# sourceMappingURL=error-util.d.ts.map