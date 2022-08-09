import { __awaiter, __generator, __values } from "tslib";
import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { app } from "../app";
import { NavigationGuard } from "./NavigationGuard";
import { executeAction } from "../module";
import { ErrorBoundary } from "../util/ErrorBoundary";
import { ajax } from "../util/network";
import { APIException } from "../Exception";
import { isIEBrowser } from "../util/navigator-util";
import { captureError, errorToException } from "../util/error-util";
import { call, delay } from "../typed-saga";
import { IdleDetector, idleTimeoutActions } from "..";
import { DEFAULT_IDLE_TIMEOUT } from "../util/IdleDetector";
export var LOGGER_ACTION = "@@framework/logger";
export var VERSION_CHECK_ACTION = "@@framework/version-check";
export var GLOBAL_ERROR_ACTION = "@@framework/global";
export var GLOBAL_PROMISE_REJECTION_ACTION = "@@framework/promise-rejection";
export function bootstrap(option) {
    var _a, _b, _c, _d, _e;
    detectIEBrowser((_a = option.browserConfig) === null || _a === void 0 ? void 0 : _a.onIE);
    setupGlobalErrorHandler(option.errorListener);
    setupAppExitListener((_b = option.loggerConfig) === null || _b === void 0 ? void 0 : _b.serverURL);
    setupLocationChangeListener((_c = option.browserConfig) === null || _c === void 0 ? void 0 : _c.onLocationChange);
    setupIdleTimeout((_d = option.idleTimeoutInSecond) !== null && _d !== void 0 ? _d : DEFAULT_IDLE_TIMEOUT);
    runBackgroundLoop(option.loggerConfig, option.versionConfig);
    renderRoot(option.componentType, option.rootContainer || injectRootContainer(), ((_e = option.browserConfig) === null || _e === void 0 ? void 0 : _e.navigationPreventionMessage) || "Are you sure to leave current page?");
}
function detectIEBrowser(onIE) {
    if (isIEBrowser()) {
        if (onIE) {
            onIE();
        }
        else {
            var ieAlertMessage = void 0;
            var navigatorLanguage = navigator.languages ? navigator.languages[0] : navigator.language;
            if (navigatorLanguage.startsWith("zh")) {
                ieAlertMessage = "对不起，本网站不支持 IE 浏览器\n请使用 Chrome/Firefox/360 浏览器再访问";
            }
            else {
                ieAlertMessage = "This website does not support IE browser.\nPlease use Chrome/Safari/Firefox to visit.\nSorry for the inconvenience.";
            }
            alert(ieAlertMessage);
        }
        // After that, the following code may still run
    }
}
function setupGlobalErrorHandler(errorListener) {
    app.errorHandler = errorListener.onError.bind(errorListener);
    window.addEventListener("error", function (event) {
        try {
            var analyzeByTarget = function () {
                if (event.target && event.target !== window) {
                    var element = event.target;
                    return "DOM source error: ".concat(element.outerHTML);
                }
                return "Unrecognized error, serialized as ".concat(JSON.stringify(event));
            };
            captureError(event.error || event.message || analyzeByTarget(), GLOBAL_ERROR_ACTION);
        }
        catch (e) {
            /**
             * This should not happen normally.
             * However, global error handler might catch external webpage errors, and fail to parse error due to cross-origin limitations.
             * A typical example is: Permission denied to access property `foo`
             */
            app.logger.warn({
                action: GLOBAL_ERROR_ACTION,
                errorCode: "ERROR_HANDLER_FAILURE",
                errorMessage: errorToException(e).message,
                elapsedTime: 0,
                info: {},
            });
        }
    }, true);
    window.addEventListener("unhandledrejection", function (event) {
        try {
            captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION);
        }
        catch (e) {
            app.logger.warn({
                action: GLOBAL_PROMISE_REJECTION_ACTION,
                errorCode: "ERROR_HANDLER_FAILURE",
                errorMessage: errorToException(e).message,
                elapsedTime: 0,
                info: {},
            });
        }
    }, true);
}
function renderRoot(EntryComponent, rootContainer, navigationPreventionMessage) {
    var root = createRoot(rootContainer);
    root.render(React.createElement(Provider, { store: app.store },
        React.createElement(IdleDetector, null,
            React.createElement(ConnectedRouter, { history: app.browserHistory },
                React.createElement(NavigationGuard, { message: navigationPreventionMessage }),
                React.createElement(ErrorBoundary, null,
                    React.createElement(EntryComponent, null))))));
}
function injectRootContainer() {
    var rootContainer = document.createElement("div");
    rootContainer.id = "framework-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}
function setupAppExitListener(eventServerURL) {
    if (eventServerURL) {
        var isIOS = /iPad|iPhone|iPod/.test(navigator.platform);
        window.addEventListener(
        // Ref: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW5
        isIOS ? "pagehide" : "unload", function () {
            try {
                app.logger.info({ action: "@@EXIT" });
                var logs = app.logger.collect();
                /**
                 * navigator.sendBeacon() uses HTTP POST, but does not support CORS.
                 * We have to use text/plain as content type, instead of JSON.
                 */
                var textData = JSON.stringify({ events: logs });
                navigator.sendBeacon(eventServerURL, textData);
            }
            catch (e) {
                // Silent if sending error
            }
        }, false);
    }
}
function setupLocationChangeListener(listener) {
    if (listener) {
        app.browserHistory.listen(listener);
    }
}
function setupIdleTimeout(timeout) {
    app.store.dispatch(idleTimeoutActions(timeout));
}
function runBackgroundLoop(loggerConfig, versionCheckConfig) {
    app.logger.info({ action: "@@ENTER" });
    app.loggerConfig = loggerConfig || null;
    if (loggerConfig) {
        app.sagaMiddleware.run(function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 3];
                        return [4 /*yield*/, delay((loggerConfig.frequencyInSecond || 20) * 1000)];
                    case 1:
                        _a.sent();
                        return [5 /*yield**/, __values(call(sendEventLogs))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    if (versionCheckConfig) {
        app.sagaMiddleware.run(function () {
            var lastChecksum, newChecksum;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lastChecksum = null;
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 7];
                        return [4 /*yield*/, delay((versionCheckConfig.frequencyInSecond || 600) * 1000)];
                    case 2:
                        _a.sent();
                        return [5 /*yield**/, __values(call(fetchVersionChecksum, versionCheckConfig.versionCheckURL))];
                    case 3:
                        newChecksum = _a.sent();
                        if (!newChecksum) return [3 /*break*/, 6];
                        if (!(lastChecksum !== null && newChecksum !== lastChecksum)) return [3 /*break*/, 5];
                        app.logger.info({
                            action: VERSION_CHECK_ACTION,
                            elapsedTime: 0,
                            info: { newChecksum: newChecksum, lastChecksum: lastChecksum },
                        });
                        return [5 /*yield**/, __values(executeAction(VERSION_CHECK_ACTION, versionCheckConfig.onRemind))];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        lastChecksum = newChecksum;
                        _a.label = 6;
                    case 6: return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }
}
export function sendEventLogs() {
    return __awaiter(this, void 0, void 0, function () {
        var logs, logLength, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!app.loggerConfig) return [3 /*break*/, 4];
                    logs = app.logger.collect(200);
                    logLength = logs.length;
                    if (!(logLength > 0)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    /**
                     * Event server URL may be different from current domain (supposing abc.com)
                     *
                     * In order to support this, we must ensure:
                     * - Event server allows cross-origin request from current domain
                     * - Root-domain cookies, whose domain is set by current domain as ".abc.com", can be sent (withCredentials = true)
                     */
                    return [4 /*yield*/, ajax("POST", app.loggerConfig.serverURL, {}, { events: logs }, { withCredentials: true })];
                case 2:
                    /**
                     * Event server URL may be different from current domain (supposing abc.com)
                     *
                     * In order to support this, we must ensure:
                     * - Event server allows cross-origin request from current domain
                     * - Root-domain cookies, whose domain is set by current domain as ".abc.com", can be sent (withCredentials = true)
                     */
                    _a.sent();
                    app.logger.emptyLastCollection();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    if (e_1 instanceof APIException) {
                        // For APIException, retry always leads to same error, so have to give up
                        // Do not log network exceptions
                        app.logger.emptyLastCollection();
                        app.logger.exception(e_1, { dropped_logs: logLength.toString() }, LOGGER_ACTION);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Only call this function if necessary, i.e: initial checksum, or after long-staying check
 * Return latest checksum, or null for failure.
 */
function fetchVersionChecksum(url) {
    return __awaiter(this, void 0, void 0, function () {
        var startTime, response, checksum, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    startTime = Date.now();
                    return [4 /*yield*/, ajax("GET", url, {}, null)];
                case 1:
                    response = _a.sent();
                    checksum = JSON.stringify(response);
                    app.logger.info({
                        action: VERSION_CHECK_ACTION,
                        elapsedTime: Date.now() - startTime,
                        info: { checksum: checksum },
                    });
                    return [2 /*return*/, checksum];
                case 2:
                    e_2 = _a.sent();
                    if (e_2 instanceof APIException) {
                        // Do not log network exceptions
                        app.logger.exception(e_2, {}, VERSION_CHECK_ACTION);
                    }
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=bootstrap.js.map