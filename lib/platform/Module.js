import { __generator } from "tslib";
import { push } from "connected-react-router";
import { put } from "redux-saga/effects";
import { produce, enablePatches, enableES5 } from "immer";
import { app } from "../app";
import { navigationPreventionAction, setStateAction } from "../reducer";
enableES5();
if (process.env.NODE_ENV === "development") {
    enablePatches();
}
var Module = /** @class */ (function () {
    function Module(name, initialState) {
        this.name = name;
        this.initialState = initialState;
    }
    Module.prototype.onEnter = function (entryComponentProps) {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    };
    Module.prototype.onDestroy = function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    };
    Module.prototype.onLocationMatched = function (routeParam, location) {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    };
    Module.prototype.onTick = function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    };
    Object.defineProperty(Module.prototype, "state", {
        get: function () {
            return this.rootState.app[this.name];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "rootState", {
        get: function () {
            return app.store.getState();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "logger", {
        get: function () {
            return app.logger;
        },
        enumerable: false,
        configurable: true
    });
    Module.prototype.setNavigationPrevented = function (isPrevented) {
        app.store.dispatch(navigationPreventionAction(isPrevented));
    };
    Module.prototype.setState = function (stateOrUpdater) {
        if (typeof stateOrUpdater === "function") {
            var originalState = this.state;
            var updater_1 = stateOrUpdater;
            var patchDescriptions_1;
            var newState = produce(originalState, function (draftState) {
                // Wrap into a void function, in case updater() might return anything
                updater_1(draftState);
            }, process.env.NODE_ENV === "development"
                ? function (patches) {
                    // No need to read "op", in will only be "replace"
                    patchDescriptions_1 = patches.map(function (_) { return _.path.join("."); });
                }
                : undefined);
            if (newState !== originalState) {
                var description = "@@".concat(this.name, "/setState").concat(patchDescriptions_1 ? "[".concat(patchDescriptions_1.join("/"), "]") : "");
                app.store.dispatch(setStateAction(this.name, newState, description));
            }
        }
        else {
            var partialState_1 = stateOrUpdater;
            this.setState(function (state) { return Object.assign(state, partialState_1); });
        }
    };
    Module.prototype.pushHistory = function (urlOrState, state) {
        var url, currentURL, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof urlOrState === "string")) return [3 /*break*/, 5];
                    url = urlOrState;
                    if (!state) return [3 /*break*/, 2];
                    return [4 /*yield*/, put(push(url, state === "keep-state" ? app.browserHistory.location.state : state))];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, put(push(url))];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    currentURL = location.pathname + location.search;
                    state_1 = urlOrState;
                    return [4 /*yield*/, put(push(currentURL, state_1))];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    };
    return Module;
}());
export { Module };
//# sourceMappingURL=Module.js.map