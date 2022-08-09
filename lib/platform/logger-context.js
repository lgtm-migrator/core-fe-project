function generateUniqueId() {
    // A UUID for current visitor, based on:
    // - Current time (in millisecond)
    // - Some random number (around 1000~10000000)
    // E.g: 169e68f80c9-1b4104
    return new Date().getTime().toString(16) + "-" + Math.floor(Math.random() * 9999900 + 1000).toString(16);
}
/**
 * CAVEAT:
 * In Apple Safari, the user may block sessionStorage access via setting "Block All Cookies".
 * The following code will throw error in such case.
 * Ref: https://codingrepo.com/javascript/2018/11/15/safari-securityerror-dom-exception-18-thrown-by-localstorage-or-cookies-are-blocked/
 */
function getSessionId() {
    try {
        var token = "@@framework-session-id";
        var previousId = sessionStorage.getItem(token);
        if (previousId) {
            return previousId;
        }
        else {
            var newId = generateUniqueId();
            sessionStorage.setItem(token, newId);
            return newId;
        }
    }
    catch (e) {
        return generateUniqueId();
    }
}
export var loggerContext = {
    request_url: function () { return location.href; },
    session_id: getSessionId(),
};
//# sourceMappingURL=logger-context.js.map