import { __assign } from "tslib";
import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import { DEFAULT_IDLE_TIMEOUT } from "./util/IdleDetector";
// Redux Action
var SET_STATE_ACTION = "@@framework/setState";
// state must be complete module state, not partial
export function setStateAction(module, state, type) {
    return {
        type: type,
        name: SET_STATE_ACTION,
        payload: { module: module, state: state },
    };
}
function setStateReducer(state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    // Use action.name for set state action, make type specifiable to make tracking/tooling easier
    if (action.name === SET_STATE_ACTION) {
        var _b = action.payload, module_1 = _b.module, moduleState = _b.state;
        return __assign(__assign({}, state), (_a = {}, _a[module_1] = moduleState, _a));
    }
    return state;
}
export var LOADING_ACTION = "@@framework/loading";
export function loadingAction(show, identifier) {
    if (identifier === void 0) { identifier = "global"; }
    return {
        type: LOADING_ACTION,
        payload: { identifier: identifier, show: show },
    };
}
function loadingReducer(state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    if (action.type === LOADING_ACTION) {
        var payload = action.payload;
        var count = state[payload.identifier] || 0;
        return __assign(__assign({}, state), (_a = {}, _a[payload.identifier] = count + (payload.show ? 1 : -1), _a));
    }
    return state;
}
var NAVIGATION_PREVENTION_ACTION = "@@framework/navigation-prevention";
export function navigationPreventionAction(isPrevented) {
    return {
        type: NAVIGATION_PREVENTION_ACTION,
        payload: { isPrevented: isPrevented },
    };
}
function navigationPreventionReducer(state, action) {
    if (state === void 0) { state = false; }
    if (action.type === NAVIGATION_PREVENTION_ACTION) {
        var payload = action.payload;
        return payload.isPrevented;
    }
    return state;
}
export var IDLE_STATE_ACTION = "@@framework/idle-state";
export function idleStateActions(state) {
    return {
        type: IDLE_STATE_ACTION,
        payload: { state: state },
    };
}
var IDLE_TIMEOUT_ACTION = "@@framework/idle-timeout";
export function idleTimeoutActions(timeout) {
    return {
        type: IDLE_TIMEOUT_ACTION,
        payload: { timeout: timeout },
    };
}
export function idleReducer(state, action) {
    if (state === void 0) { state = { timeout: DEFAULT_IDLE_TIMEOUT, state: "active" }; }
    if (action.type === IDLE_STATE_ACTION) {
        var payload = action.payload;
        return __assign(__assign({}, state), { state: payload.state });
    }
    else if (action.type === IDLE_TIMEOUT_ACTION) {
        var payload = action.payload;
        return __assign(__assign({}, state), { timeout: payload.timeout });
    }
    else {
        return state;
    }
}
// Root Reducer
export function rootReducer(history) {
    return combineReducers({
        router: connectRouter(history),
        loading: loadingReducer,
        app: setStateReducer,
        navigationPrevented: navigationPreventionReducer,
        idle: idleReducer,
    });
}
// Helper function, to determine if show loading
export function showLoading(state, identifier) {
    if (identifier === void 0) { identifier = "global"; }
    return state.loading[identifier] > 0;
}
//# sourceMappingURL=reducer.js.map