import { __generator, __values } from "tslib";
import { Exception, JavaScriptException } from "../Exception";
import { app } from "../app";
import { isIEBrowser } from "./navigator-util";
import { spawn } from "../typed-saga";
import { GLOBAL_ERROR_ACTION, GLOBAL_PROMISE_REJECTION_ACTION, sendEventLogs } from "../platform/bootstrap";
var errorHandlerRunning = false;
export function errorToException(error) {
    if (error instanceof Exception) {
        return error;
    }
    else {
        var message = void 0;
        if (!error) {
            message = "[No Message]";
        }
        else if (typeof error === "string") {
            message = error;
        }
        else if (error instanceof Error) {
            message = error.message;
        }
        else {
            try {
                message = JSON.stringify(error);
            }
            catch (e) {
                message = "[Unknown]";
            }
        }
        return new JavaScriptException(message, error);
    }
}
export function captureError(error, action, extra) {
    if (extra === void 0) { extra = {}; }
    if (process.env.NODE_ENV === "development") {
        console.error("[framework] Error captured from [".concat(action, "]"), error);
    }
    var exception = errorToException(error);
    var errorStacktrace = error instanceof Error ? error.stack : undefined;
    var info = {
        payload: extra.actionPayload,
        extra_stacktrace: extra.extraStacktrace,
        stacktrace: errorStacktrace,
    };
    var errorCode = specialErrorCode(exception, action, errorStacktrace);
    if (errorCode) {
        app.logger.warn({
            action: action,
            elapsedTime: 0,
            info: info,
            errorMessage: exception.message,
            errorCode: errorCode,
        });
    }
    else {
        app.logger.exception(exception, info, action);
        app.sagaMiddleware.run(runUserErrorHandler, app.errorHandler, exception);
    }
    return exception;
}
export function runUserErrorHandler(handler, exception) {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // For app, report errors to event server ASAP, in case of sudden termination
            return [4 /*yield*/, spawn(sendEventLogs)];
            case 1:
                // For app, report errors to event server ASAP, in case of sudden termination
                _a.sent();
                if (errorHandlerRunning)
                    return [2 /*return*/];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, 5, 6]);
                errorHandlerRunning = true;
                return [5 /*yield**/, __values(handler(exception))];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4:
                e_1 = _a.sent();
                console.warn("[framework] Fail to execute error handler", e_1);
                return [3 /*break*/, 6];
            case 5:
                errorHandlerRunning = false;
                return [7 /*endfinally*/];
            case 6: return [2 /*return*/];
        }
    });
}
function specialErrorCode(exception, action, stacktrace) {
    var errorMessage = exception.message.toLowerCase();
    var ignoredPatterns = [
        // Network error while downloading JavaScript/CSS (webpack async loading)
        { pattern: "loading chunk", errorCode: "JS_CHUNK" },
        { pattern: "loading css chunk", errorCode: "CSS_CHUNK" },
        // CORS or CSP issues
        { pattern: "content security policy", errorCode: "CSP" },
        { pattern: "script error", errorCode: "CORS" },
        // Vendor injected, mostly still with stacktrace
        { pattern: "ucbrowser", errorCode: "VENDOR" },
        { pattern: "vivo", errorCode: "VENDOR" },
        { pattern: "huawei", errorCode: "VENDOR" },
        // Browser sandbox issues
        { pattern: "the operation is insecure", errorCode: "BROWSER_LIMIT" },
        { pattern: "access is denied for this document", errorCode: "BROWSER_LIMIT" },
    ];
    if (isIEBrowser()) {
        return "IE_BROWSER_ISSUE";
    }
    var matchedPattern = ignoredPatterns.find(function (_a) {
        var pattern = _a.pattern;
        return errorMessage.includes(pattern);
    });
    if (matchedPattern) {
        return "IGNORED_".concat(matchedPattern.errorCode, "_ISSUE");
    }
    if (exception instanceof JavaScriptException && !isValidStacktrace(stacktrace) && [GLOBAL_ERROR_ACTION, GLOBAL_PROMISE_REJECTION_ACTION].includes(action)) {
        return "IGNORED_UNCATEGORIZED_ISSUE";
    }
    if (action === GLOBAL_ERROR_ACTION && stacktrace && errorMessage.includes("minified react error #188") && stacktrace.includes("getRootDomNode")) {
        return "IGNORED_ANTD_POPOVER_ISSUE";
    }
    return null;
}
function isValidStacktrace(stacktrace) {
    if (stacktrace) {
        var ignoredPatterns = ["chrome-extension://"];
        if (ignoredPatterns.some(function (_) { return stacktrace.includes(_); })) {
            return false;
        }
        /**
         * Use fuzzy search, instead of document.querySelectorAll("script") to get all script tag URLs.
         *
         * The reason is, in latest webpack, the code-split chunk script is just injected and then removed.
         * In other words, the <script> tag only exists temporarily, not persisted in the DOM.
         */
        return stacktrace.includes(".js");
    }
    return false;
}
//# sourceMappingURL=error-util.js.map