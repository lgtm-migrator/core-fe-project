import { __generator, __read, __spreadArray, __values } from "tslib";
import { app } from "../app";
import { stringifyWithMask } from "../util/json-util";
export { Interval } from "./Interval";
export { Loading } from "./Loading";
export { Log } from "./Log";
export { Mutex } from "./Mutex";
export { RetryOnNetworkConnectionError } from "./RetryOnNetworkConnectionError";
export { SilentOnNetworkConnectionError } from "./SilentOnNetworkConnectionError";
/**
 * A helper for ActionHandler functions (Saga).
 */
export function createActionHandlerDecorator(interceptor) {
    return function (target, propertyKey, descriptor) {
        var fn = descriptor.value;
        descriptor.value = function () {
            var _i, boundFn;
            var _a;
            var args = [];
            for (_i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        boundFn = fn.bind.apply(fn, __spreadArray([this], __read(args), false));
                        // Do not use fn.actionName, it returns undefined
                        // The reason is, fn is created before module register(), and the actionName had not been attached then
                        boundFn.actionName = descriptor.value.actionName;
                        boundFn.maskedParams = stringifyWithMask.apply(void 0, __spreadArray([((_a = app.loggerConfig) === null || _a === void 0 ? void 0 : _a.maskedKeywords) || [], "***"], __read(args), false)) || "[No Parameter]";
                        return [5 /*yield**/, __values(interceptor(boundFn, this))];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        };
        return descriptor;
    };
}
//# sourceMappingURL=index.js.map