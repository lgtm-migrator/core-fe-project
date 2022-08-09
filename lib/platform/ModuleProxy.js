import { __assign, __extends, __generator } from "tslib";
import React from "react";
import { delay, call as rawCall, take, select, cancel, fork } from "redux-saga/effects";
import { app } from "../app";
import { executeAction } from "../module";
import { IDLE_STATE_ACTION, navigationPreventionAction } from "../reducer";
var startupModuleName = null;
var ModuleProxy = /** @class */ (function () {
    function ModuleProxy(module, actions) {
        this.module = module;
        this.actions = actions;
    }
    ModuleProxy.prototype.getActions = function () {
        return this.actions;
    };
    ModuleProxy.prototype.attachLifecycle = function (ComponentType) {
        var _a;
        var moduleName = this.module.name;
        var lifecycleListener = this.module;
        var modulePrototype = Object.getPrototypeOf(lifecycleListener);
        var actions = this.actions;
        return _a = /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1(props) {
                    var _this = _super.call(this, props) || this;
                    _this.lifecycleSagaTask = null;
                    _this.lastDidUpdateSagaTask = null;
                    _this.tickCount = 0;
                    _this.mountedTime = Date.now();
                    _this.areLocationsEqual = function (a, b) {
                        return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && a.state === b.state;
                    };
                    _this.hasOwnLifecycle = function (methodName) {
                        return Object.prototype.hasOwnProperty.call(modulePrototype, methodName);
                    };
                    if (!startupModuleName) {
                        startupModuleName = moduleName;
                    }
                    return _this;
                }
                class_1.prototype.componentDidMount = function () {
                    this.lifecycleSagaTask = app.sagaMiddleware.run(this.lifecycleSaga.bind(this));
                };
                class_1.prototype.componentDidUpdate = function (prevProps) {
                    var _a;
                    var prevLocation = prevProps.location;
                    var props = this.props;
                    var currentLocation = props.location;
                    var currentRouteParams = props.match ? props.match.params : null;
                    /**
                     * Only trigger onLocationMatched if current component is connected to <Route>, and location literally changed.
                     *
                     * CAVEAT:
                     *  Do not use !== to compare locations.
                     *  Because in "connected-react-router", location from rootState.router.location is not equal to current history.location in reference.
                     */
                    if (currentLocation && currentRouteParams && !this.areLocationsEqual(currentLocation, prevLocation) && this.hasOwnLifecycle("onLocationMatched")) {
                        try {
                            (_a = this.lastDidUpdateSagaTask) === null || _a === void 0 ? void 0 : _a.cancel();
                        }
                        catch (e) {
                            // In rare case, it may throw error, just ignore
                        }
                        this.lastDidUpdateSagaTask = app.sagaMiddleware.run(function () {
                            var action, startTime;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        action = "".concat(moduleName, "/@@LOCATION_MATCHED");
                                        startTime = Date.now();
                                        return [4 /*yield*/, rawCall(executeAction, action, lifecycleListener.onLocationMatched.bind(lifecycleListener), currentRouteParams, currentLocation)];
                                    case 1:
                                        _a.sent();
                                        app.logger.info({
                                            action: action,
                                            elapsedTime: Date.now() - startTime,
                                            info: {
                                                // URL params should not contain any sensitive or complicated objects
                                                route_params: JSON.stringify(currentRouteParams),
                                                history_state: JSON.stringify(currentLocation.state),
                                            },
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        });
                        app.store.dispatch(navigationPreventionAction(false));
                    }
                };
                class_1.prototype.componentWillUnmount = function () {
                    var _a, _b;
                    if (this.hasOwnLifecycle("onDestroy")) {
                        app.store.dispatch(actions.onDestroy());
                    }
                    var currentLocation = this.props.location;
                    if (currentLocation) {
                        // Only cancel navigation prevention if current component is connected to <Route>
                        app.store.dispatch(navigationPreventionAction(false));
                    }
                    app.logger.info({
                        action: "".concat(moduleName, "/@@DESTROY"),
                        info: {
                            tick_count: this.tickCount.toString(),
                            staying_second: ((Date.now() - this.mountedTime) / 1000).toFixed(2),
                        },
                    });
                    try {
                        (_a = this.lastDidUpdateSagaTask) === null || _a === void 0 ? void 0 : _a.cancel();
                        (_b = this.lifecycleSagaTask) === null || _b === void 0 ? void 0 : _b.cancel();
                    }
                    catch (e) {
                        // In rare case, it may throw error, just ignore
                    }
                };
                class_1.prototype.render = function () {
                    return React.createElement(ComponentType, __assign({}, this.props));
                };
                class_1.prototype.lifecycleSaga = function () {
                    var props, enterActionName, startTime, initialRenderActionName, startTime_1, routeParams;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                props = this.props;
                                enterActionName = "".concat(moduleName, "/@@ENTER");
                                startTime = Date.now();
                                return [4 /*yield*/, rawCall(executeAction, enterActionName, lifecycleListener.onEnter.bind(lifecycleListener), props)];
                            case 1:
                                _a.sent();
                                app.logger.info({
                                    action: enterActionName,
                                    elapsedTime: Date.now() - startTime,
                                    info: {
                                        component_props: JSON.stringify(props),
                                    },
                                });
                                if (!this.hasOwnLifecycle("onLocationMatched")) return [3 /*break*/, 4];
                                if (!("match" in props && "location" in props)) return [3 /*break*/, 3];
                                initialRenderActionName = "".concat(moduleName, "/@@LOCATION_MATCHED");
                                startTime_1 = Date.now();
                                routeParams = props.match.params;
                                return [4 /*yield*/, rawCall(executeAction, initialRenderActionName, lifecycleListener.onLocationMatched.bind(lifecycleListener), routeParams, props.location)];
                            case 2:
                                _a.sent();
                                app.logger.info({
                                    action: initialRenderActionName,
                                    elapsedTime: Date.now() - startTime_1,
                                    info: {
                                        route_params: JSON.stringify(props.match.params),
                                        history_state: JSON.stringify(props.location.state),
                                    },
                                });
                                return [3 /*break*/, 4];
                            case 3:
                                console.error("[framework] Module component [".concat(moduleName, "] is non-route, use onEnter() instead of onLocationMatched()"));
                                _a.label = 4;
                            case 4:
                                if (moduleName === startupModuleName) {
                                    createStartupPerformanceLog("".concat(moduleName, "/@@STARTUP_PERF"));
                                }
                                if (!this.hasOwnLifecycle("onTick")) return [3 /*break*/, 6];
                                return [4 /*yield*/, rawCall(this.onTickWatcherSaga.bind(this))];
                            case 5:
                                _a.sent();
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                };
                class_1.prototype.onTickWatcherSaga = function () {
                    var runningIntervalTask, isActive;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fork(this.onTickSaga.bind(this))];
                            case 1:
                                runningIntervalTask = _a.sent();
                                _a.label = 2;
                            case 2:
                                if (!true) return [3 /*break*/, 8];
                                return [4 /*yield*/, take(IDLE_STATE_ACTION)];
                            case 3:
                                _a.sent();
                                return [4 /*yield*/, cancel(runningIntervalTask)];
                            case 4:
                                _a.sent(); // no-op if already cancelled
                                return [4 /*yield*/, select(function (state) { return state.idle.state === "active"; })];
                            case 5:
                                isActive = _a.sent();
                                if (!isActive) return [3 /*break*/, 7];
                                return [4 /*yield*/, fork(this.onTickSaga.bind(this))];
                            case 6:
                                runningIntervalTask = _a.sent();
                                _a.label = 7;
                            case 7: return [3 /*break*/, 2];
                            case 8: return [2 /*return*/];
                        }
                    });
                };
                class_1.prototype.onTickSaga = function () {
                    var tickIntervalInMillisecond, boundTicker, tickActionName;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                tickIntervalInMillisecond = (lifecycleListener.onTick.tickInterval || 5) * 1000;
                                boundTicker = lifecycleListener.onTick.bind(lifecycleListener);
                                tickActionName = "".concat(moduleName, "/@@TICK");
                                _a.label = 1;
                            case 1:
                                if (!true) return [3 /*break*/, 4];
                                return [4 /*yield*/, rawCall(executeAction, tickActionName, boundTicker)];
                            case 2:
                                _a.sent();
                                this.tickCount++;
                                return [4 /*yield*/, delay(tickIntervalInMillisecond)];
                            case 3:
                                _a.sent();
                                return [3 /*break*/, 1];
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                return class_1;
            }(React.PureComponent)),
            _a.displayName = "Module[".concat(moduleName, "]"),
            _a;
    };
    return ModuleProxy;
}());
export { ModuleProxy };
function createStartupPerformanceLog(actionName) {
    var _a;
    if (window.performance && performance.timing) {
        // For performance timing API, please refer: https://www.w3.org/blog/2012/09/performance-timing-information/
        var now = Date.now();
        var perfTiming = performance.timing;
        var baseTime_1 = perfTiming.navigationStart;
        var duration = now - baseTime_1;
        var stats_1 = {};
        var createStat = function (key, timeStamp) {
            if (timeStamp >= baseTime_1) {
                stats_1[key] = timeStamp - baseTime_1;
            }
        };
        createStat("http_start", perfTiming.requestStart);
        createStat("http_end", perfTiming.responseEnd);
        createStat("dom_start", perfTiming.domLoading);
        createStat("dom_content", perfTiming.domContentLoadedEventEnd); // Mostly same time with domContentLoadedEventStart
        createStat("dom_end", perfTiming.loadEventEnd); // Mostly same with domComplete/loadEventStart
        var slowStartupThreshold = ((_a = app.loggerConfig) === null || _a === void 0 ? void 0 : _a.slowStartupThresholdInSecond) || 5;
        if (duration / 1000 >= slowStartupThreshold) {
            app.logger.warn({
                action: actionName,
                elapsedTime: duration,
                stats: stats_1,
                errorCode: "SLOW_STARTUP",
                errorMessage: "Startup took ".concat((duration / 1000).toFixed(2), " sec, longer than ").concat(slowStartupThreshold),
            });
        }
        else {
            app.logger.info({
                action: actionName,
                elapsedTime: duration,
                stats: stats_1,
            });
        }
    }
}
//# sourceMappingURL=ModuleProxy.js.map