import { __generator, __read, __spreadArray } from "tslib";
import { call as rawCall, race as rawRace, spawn, all as rawAll, delay, put } from "redux-saga/effects";
export function call(fn) {
    var _i;
    var args = [];
    for (_i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, rawCall.apply(void 0, __spreadArray([fn], __read(args), false))];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}
export function race(effects) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, rawRace(effects)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}
export function all(effects) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, rawAll(effects)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}
export { spawn, delay, put };
//# sourceMappingURL=typed-saga.js.map