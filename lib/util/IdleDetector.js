import React from "react";
import { idleStateActions } from "../reducer";
import { useDispatch, useSelector } from "react-redux";
export var DEFAULT_IDLE_TIMEOUT = 300;
export var IdleDetectorContext = React.createContext({
    timeout: DEFAULT_IDLE_TIMEOUT,
    state: "active",
});
function createTimer(time, callback) {
    var timer;
    function start() {
        timer = window.setTimeout(function () { return callback("idle"); }, time * 1000);
    }
    function reset() {
        clearTimeout(timer);
        callback("active");
        start();
    }
    function clear() {
        clearTimeout(timer);
    }
    return { start: start, reset: reset, clear: clear };
}
export function IdleDetector(props) {
    var children = props.children;
    var _a = useSelector(function (state) { return state.idle; }), timeout = _a.timeout, state = _a.state;
    var stateRef = React.useRef(state);
    stateRef.current = state;
    var dispatch = useDispatch();
    React.useEffect(function () {
        if (timeout > 0) {
            var idleTimer_1 = createTimer(timeout, function (newIdleState) {
                if (newIdleState !== stateRef.current) {
                    dispatch(idleStateActions(newIdleState));
                }
            });
            idleTimer_1.start();
            window.addEventListener("click", idleTimer_1.reset);
            window.addEventListener("touchmove", idleTimer_1.reset);
            window.addEventListener("keydown", idleTimer_1.reset);
            window.addEventListener("mousemove", idleTimer_1.reset);
            return function () {
                window.removeEventListener("click", idleTimer_1.reset);
                window.removeEventListener("touchmove", idleTimer_1.reset);
                window.removeEventListener("keydown", idleTimer_1.reset);
                window.removeEventListener("mousemove", idleTimer_1.reset);
                idleTimer_1.clear();
            };
        }
    }, [timeout]);
    return React.createElement(IdleDetectorContext.Provider, { value: { state: state, timeout: timeout } }, children);
}
//# sourceMappingURL=IdleDetector.js.map