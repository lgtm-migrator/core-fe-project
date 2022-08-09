import { __generator, __values } from "tslib";
import { createActionHandlerDecorator } from "./index";
import { put } from "redux-saga/effects";
import { loadingAction } from "../reducer";
/**
 * To mark state.loading[identifier] during action execution.
 */
export function Loading(identifier) {
    if (identifier === void 0) { identifier = "global"; }
    return createActionHandlerDecorator(function (handler) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, , 3, 5]);
                    return [4 /*yield*/, put(loadingAction(true, identifier))];
                case 1:
                    _a.sent();
                    return [5 /*yield**/, __values(handler())];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, put(loadingAction(false, identifier))];
                case 4:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=Loading.js.map