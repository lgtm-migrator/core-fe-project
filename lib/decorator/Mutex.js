import { __generator, __values } from "tslib";
import { createActionHandlerDecorator } from "./index";
/**
 * If specified, the action cannot be entered by other sagas during execution.
 * For error handler action, mutex logic is auto added.
 */
export function Mutex() {
    var lockTime = null;
    return createActionHandlerDecorator(function (handler, thisModule) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!lockTime) return [3 /*break*/, 1];
                    thisModule.logger.info({
                        action: handler.actionName,
                        info: {
                            payload: handler.maskedParams,
                            mutex_locked_duration: (Date.now() - lockTime).toString(),
                        },
                    });
                    return [3 /*break*/, 4];
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    lockTime = Date.now();
                    return [5 /*yield**/, __values(handler())];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    lockTime = null;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=Mutex.js.map