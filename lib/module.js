import { __generator, __read, __spreadArray, __values } from "tslib";
import { app } from "./app";
import { ModuleProxy } from "./platform/ModuleProxy";
import { setStateAction } from "./reducer";
import { captureError } from "./util/error-util";
import { stringifyWithMask } from "./util/json-util";
export function register(module) {
    var moduleName = module.name;
    if (!app.store.getState().app[moduleName]) {
        // To get private property
        app.store.dispatch(setStateAction(moduleName, module.initialState, "@@".concat(moduleName, "/@@init")));
    }
    // Transform every method into ActionCreator
    var actions = {};
    getKeys(module).forEach(function (actionType) {
        // Attach action name, for @Log / error handler reflection
        var method = module[actionType];
        var qualifiedActionType = "".concat(moduleName, "/").concat(actionType);
        method.actionName = qualifiedActionType;
        actions[actionType] = function () {
            var payload = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                payload[_i] = arguments[_i];
            }
            return ({ type: qualifiedActionType, payload: payload });
        };
        app.actionHandlers[qualifiedActionType] = method.bind(module);
    });
    return new ModuleProxy(module, actions);
}
export function executeAction(actionName, handler) {
    var _i, error_1, actionPayload;
    var _a;
    var payload = [];
    for (_i = 2; _i < arguments.length; _i++) {
        payload[_i - 2] = arguments[_i];
    }
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [5 /*yield**/, __values(handler.apply(void 0, __spreadArray([], __read(payload), false)))];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                actionPayload = stringifyWithMask.apply(void 0, __spreadArray([((_a = app.loggerConfig) === null || _a === void 0 ? void 0 : _a.maskedKeywords) || [], "***"], __read(payload), false)) || "[No Parameter]";
                captureError(error_1, actionName, { actionPayload: actionPayload });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}
function getKeys(module) {
    var e_1, _a;
    // Do not use Object.keys(Object.getPrototypeOf(module)), because class methods are not enumerable
    var keys = [];
    try {
        for (var _b = __values(Object.getOwnPropertyNames(Object.getPrototypeOf(module))), _c = _b.next(); !_c.done; _c = _b.next()) {
            var propertyName = _c.value;
            if (module[propertyName] instanceof Function && propertyName !== "constructor") {
                keys.push(propertyName);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return keys;
}
//# sourceMappingURL=module.js.map