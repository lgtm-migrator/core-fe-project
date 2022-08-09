import { app } from "./app";
if (process.env.NODE_ENV === "development") {
    if (window) {
        window.__GET_LOGS__ = function () { return app.logger.collect(); };
        window.__PRINT_LOGS__ = function () {
            var logs = app.logger.collect();
            logs.forEach(function (_, index) {
                var colorString;
                if (_.result === "OK") {
                    colorString = "background:green; color:#fff";
                }
                else if (_.result === "ERROR") {
                    colorString = "background:red; color:#fff";
                }
                else {
                    colorString = "background:yellow; color:#888";
                }
                console.info("%c".concat(index + 1, ". ").concat(_.action).concat(_.elapsedTime > 0 ? " (".concat(_.elapsedTime, " ms)") : ""), colorString, _.date.toLocaleString());
                if (_.errorCode) {
                    console.info("%c ".concat(_.errorCode, ": ").concat(_.errorMessage, " "), "background:red; color:#fff");
                }
                if (Object.keys(_.info).length > 0) {
                    console.info("%c INFO ", "background:#ddd; color:#111", _.info);
                }
                if (Object.keys(_.stats).length > 0) {
                    console.info("%c STATS ", "background:#ddd; color:#111", _.stats);
                }
            });
        };
    }
}
//# sourceMappingURL=debug.js.map