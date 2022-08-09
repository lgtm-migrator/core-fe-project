import { __assign, __read } from "tslib";
import { loggerContext } from "./platform/logger-context";
import { errorToException } from "./util/error-util";
import { app } from "./app";
import { APIException, JavaScriptException, NetworkConnectionException } from "./Exception";
var LoggerImpl = /** @class */ (function () {
    function LoggerImpl() {
        this.contextMap = {};
        this.logQueue = [];
        this.collectPosition = 0;
        this.contextMap = loggerContext;
    }
    LoggerImpl.prototype.addContext = function (context) {
        var newContextMap = __assign(__assign({}, this.contextMap), context);
        var contextSize = Object.keys(newContextMap).length;
        if (contextSize > 20) {
            console.warn("[framework] Logger context size ".concat(contextSize, " is too large"));
        }
        this.contextMap = newContextMap;
    };
    LoggerImpl.prototype.removeContext = function (key) {
        if (this.contextMap[key] !== undefined) {
            delete this.contextMap[key];
        }
        else {
            console.warn("[framework] Logger context key ".concat(key, " does not exist"));
        }
    };
    LoggerImpl.prototype.info = function (entry) {
        this.createLog("OK", entry);
    };
    LoggerImpl.prototype.warn = function (entry) {
        this.createLog("WARN", entry);
    };
    LoggerImpl.prototype.error = function (entry) {
        this.createLog("ERROR", entry);
    };
    LoggerImpl.prototype.exception = function (exception, extraInfo, action) {
        var isWarning;
        var errorCode;
        var info = __assign({}, extraInfo);
        if (exception instanceof NetworkConnectionException) {
            isWarning = true;
            errorCode = "NETWORK_FAILURE";
            info["api_url"] = exception.requestURL;
            info["original_message"] = exception.originalErrorMessage;
        }
        else if (exception instanceof APIException) {
            if (exception.statusCode === 400 && exception.errorCode === "VALIDATION_ERROR") {
                isWarning = false;
                errorCode = "API_VALIDATION_ERROR";
            }
            else {
                isWarning = true;
                errorCode = "API_ERROR_".concat(exception.statusCode);
            }
            info["api_url"] = exception.requestURL;
            info["api_response"] = JSON.stringify(exception.responseData);
            if (exception.errorId) {
                info["api_error_id"] = exception.errorId;
            }
            if (exception.errorCode) {
                info["api_error_code"] = exception.errorCode;
            }
        }
        else if (exception instanceof JavaScriptException) {
            isWarning = false;
            errorCode = "JAVASCRIPT_ERROR";
            info["app_state"] = JSON.stringify(app.store.getState().app);
        }
        else {
            console.warn("[framework] Exception class should not be extended, throw Error instead");
            isWarning = false;
            errorCode = "JAVASCRIPT_ERROR";
        }
        this.createLog(isWarning ? "WARN" : "ERROR", { action: action, errorCode: errorCode, errorMessage: exception.message, info: info, elapsedTime: 0 });
    };
    LoggerImpl.prototype.collect = function (maxSize) {
        if (maxSize === void 0) { maxSize = 0; }
        var totalLength = this.logQueue.length;
        if (maxSize > 0 && maxSize < totalLength) {
            this.collectPosition = maxSize;
            return this.logQueue.slice(0, maxSize);
        }
        else {
            this.collectPosition = totalLength;
            return this.logQueue;
        }
    };
    LoggerImpl.prototype.emptyLastCollection = function () {
        this.logQueue = this.logQueue.slice(this.collectPosition);
    };
    LoggerImpl.prototype.createLog = function (result, entry) {
        // Generate context
        var context = {};
        Object.entries(this.contextMap).map(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            if (typeof value === "string") {
                context[key] = value.substr(0, 1000);
            }
            else {
                try {
                    context[key] = value();
                }
                catch (e) {
                    var message = errorToException(e).message;
                    context[key] = "ERR# " + message;
                    console.warn("[framework] Fail to execute logger context: " + message);
                }
            }
        });
        // Generate info
        var info = {};
        if (entry.info) {
            Object.entries(entry.info).map(function (_a) {
                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                if (value !== undefined) {
                    var isBuiltinInfo = ["app_state", "stacktrace", "extra_stacktrace"].includes(key);
                    info[key] = isBuiltinInfo ? value.substr(0, 500000) : value.substr(0, 500);
                }
            });
        }
        // Generate stats
        var stats = {};
        if (entry.stats) {
            Object.entries(entry.stats).map(function (_a) {
                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                if (value !== undefined) {
                    stats[key] = value;
                }
            });
        }
        var event = {
            date: new Date(),
            action: entry.action,
            elapsedTime: entry.elapsedTime || 0,
            result: result,
            context: context,
            info: info,
            stats: stats,
            errorCode: "errorCode" in entry ? entry.errorCode : undefined,
            errorMessage: "errorMessage" in entry ? entry.errorMessage.substring(0, 1000) : undefined,
        };
        this.logQueue.push(event);
    };
    return LoggerImpl;
}());
export { LoggerImpl };
//# sourceMappingURL=Logger.js.map