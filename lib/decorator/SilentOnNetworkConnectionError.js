import { __generator, __values } from "tslib";
import { NetworkConnectionException } from "../Exception";
import { createActionHandlerDecorator } from "./index";
import { app } from "../app";
/**
 * Do nothing (only create a warning log) if NetworkConnectionException is thrown.
 * Mainly used for background tasks.
 */
export function SilentOnNetworkConnectionError() {
    return createActionHandlerDecorator(function (handler) {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [5 /*yield**/, __values(handler())];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    if (e_1 instanceof NetworkConnectionException) {
                        app.logger.exception(e_1, {
                            payload: handler.maskedParams,
                            process_method: "silent",
                        }, handler.actionName);
                    }
                    else {
                        throw e_1;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=SilentOnNetworkConnectionError.js.map