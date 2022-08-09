import { __generator, __read, __spreadArray, __values } from "tslib";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { takeEvery } from "redux-saga/effects";
import { LoggerImpl } from "./Logger";
import { executeAction } from "./module";
import { LOADING_ACTION, rootReducer } from "./reducer";
import { captureError } from "./util/error-util";
export var app = createApp();
export var logger = app.logger;
function composeWithDevTools(enhancer) {
    var composeEnhancers = compose;
    if (process.env.NODE_ENV === "development") {
        var extension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
        if (extension) {
            composeEnhancers = extension({
                // Ref: https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md#actionsdenylist--actionsallowlist
                actionsDenylist: [LOADING_ACTION],
            });
        }
    }
    return composeEnhancers(enhancer);
}
function createApp() {
    var browserHistory = createBrowserHistory();
    var eventLogger = new LoggerImpl();
    var sagaMiddleware = createSagaMiddleware({
        onError: function (error, info) { return captureError(error, "@@framework/detached-saga", { extraStacktrace: info.sagaStack }); },
    });
    var store = createStore(rootReducer(browserHistory), composeWithDevTools(applyMiddleware(routerMiddleware(browserHistory), sagaMiddleware)));
    sagaMiddleware.run(function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, takeEvery("*", function (action) {
                        var handler;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    handler = app.actionHandlers[action.type];
                                    if (!handler) return [3 /*break*/, 2];
                                    return [5 /*yield**/, __values(executeAction.apply(void 0, __spreadArray([action.type, handler], __read(action.payload), false)))];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
    return {
        browserHistory: browserHistory,
        store: store,
        sagaMiddleware: sagaMiddleware,
        actionHandlers: {},
        logger: eventLogger,
        loggerConfig: null,
        errorHandler: function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); },
    };
}
//# sourceMappingURL=app.js.map