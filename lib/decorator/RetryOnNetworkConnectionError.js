import { __generator, __values } from "tslib";
import { app } from "../app";
import { NetworkConnectionException } from "../Exception";
import { delay } from "redux-saga/effects";
import { createActionHandlerDecorator } from "./index";
/**
 * Re-execute the action if NetworkConnectionException is thrown.
 * A warning log will be also created, for each retry.
 */
export function RetryOnNetworkConnectionError(retryIntervalSecond) {
    if (retryIntervalSecond === void 0) { retryIntervalSecond = 3; }
    return createActionHandlerDecorator(function (handler) {
        var retryTime, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    retryTime = 0;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 9];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 8]);
                    return [5 /*yield**/, __values(handler())];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 4:
                    e_1 = _a.sent();
                    if (!(e_1 instanceof NetworkConnectionException)) return [3 /*break*/, 6];
                    retryTime++;
                    app.logger.exception(e_1, {
                        payload: handler.maskedParams,
                        process_method: "will retry #".concat(retryTime),
                    }, handler.actionName);
                    return [4 /*yield*/, delay(retryIntervalSecond * 1000)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6: throw e_1;
                case 7: return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 1];
                case 9: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=RetryOnNetworkConnectionError.js.map