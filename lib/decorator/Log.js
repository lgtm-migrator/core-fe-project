import { __generator, __values } from "tslib";
import { createActionHandlerDecorator } from "./index";
/**
 * To add a log item for action, with execution duration, action name, and masked action parameters.
 */
export function Log() {
    return createActionHandlerDecorator(function (handler, thisModule) {
        var startTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [5 /*yield**/, __values(handler())];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    thisModule.logger.info({
                        action: handler.actionName,
                        elapsedTime: Date.now() - startTime,
                        info: { payload: handler.maskedParams },
                    });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=Log.js.map