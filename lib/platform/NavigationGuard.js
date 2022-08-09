import { __extends } from "tslib";
import React from "react";
import { connect } from "react-redux";
import { Prompt } from "react-router";
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Component.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, message = _a.message, isPrevented = _a.isPrevented;
        if (prevProps.isPrevented !== isPrevented) {
            window.onbeforeunload = isPrevented ? function () { return message; } : null;
        }
    };
    Component.prototype.render = function () {
        var _a = this.props, isPrevented = _a.isPrevented, message = _a.message;
        return React.createElement(Prompt, { message: message, when: isPrevented });
    };
    return Component;
}(React.PureComponent));
var mapStateToProps = function (state) { return ({ isPrevented: state.navigationPrevented }); };
export var NavigationGuard = connect(mapStateToProps)(Component);
//# sourceMappingURL=NavigationGuard.js.map