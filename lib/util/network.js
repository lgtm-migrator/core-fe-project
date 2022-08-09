import { __assign, __awaiter, __generator, __read } from "tslib";
import axios from "axios";
import { APIException, NetworkConnectionException } from "../Exception";
import { parseWithDate } from "./json-util";
axios.defaults.transformResponse = function (data, headers) {
    if (data) {
        // API response may be void, in such case, JSON.parse will throw error
        var contentType = headers === null || headers === void 0 ? void 0 : headers["content-type"];
        if (contentType === null || contentType === void 0 ? void 0 : contentType.startsWith("application/json")) {
            return parseWithDate(data);
        }
        else {
            throw new NetworkConnectionException("ajax() response not in JSON format", "");
        }
    }
    else {
        return data;
    }
};
axios.interceptors.response.use(function (response) { return response; }, function (error) {
    if (axios.isAxiosError(error)) {
        var typedError = error;
        var requestURL = typedError.config.url || "-";
        if (typedError.response) {
            var responseData = typedError.response.data;
            // Treat "cloud" error as Network Exception, e.g: gateway/load balancer issue,
            var networkErrorStatusCodes = [0, 502, 504];
            if (responseData && !networkErrorStatusCodes.includes(typedError.response.status)) {
                // Try to get server error message/ID/code from response
                var errorId = (responseData === null || responseData === void 0 ? void 0 : responseData.id) || null;
                var errorCode = (responseData === null || responseData === void 0 ? void 0 : responseData.errorCode) || null;
                var errorMessage = responseData.message || "[No Response]";
                throw new APIException(errorMessage, typedError.response.status, requestURL, responseData, errorId, errorCode);
            }
        }
        throw new NetworkConnectionException("Failed to connect: ".concat(requestURL), requestURL, "".concat(typedError.code || "UNKNOWN", ": ").concat(typedError.message));
    }
    else if (error instanceof NetworkConnectionException) {
        throw error;
    }
    else {
        throw new NetworkConnectionException("Unknown network error", "[No URL]", error.toString());
    }
});
export function ajax(method, path, pathParams, request, extraConfig) {
    if (extraConfig === void 0) { extraConfig = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var fullURL, config, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fullURL = urlParams(path, pathParams);
                    config = __assign(__assign({}, extraConfig), { method: method, url: fullURL });
                    if (method === "GET" || method === "DELETE") {
                        config.params = request;
                    }
                    else if (method === "POST" || method === "PUT" || method === "PATCH") {
                        config.data = request;
                    }
                    config.headers = {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    };
                    return [4 /*yield*/, axios.request(config)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
            }
        });
    });
}
export function uri(path, request) {
    var config = { method: "GET", url: path, params: request };
    return axios.getUri(config);
}
export function urlParams(pattern, params) {
    if (!params) {
        return pattern;
    }
    var url = pattern;
    Object.entries(params).forEach(function (_a) {
        var _b = __read(_a, 2), name = _b[0], value = _b[1];
        var encodedValue = encodeURIComponent(value.toString());
        url = url.replace(":" + name, encodedValue);
    });
    return url;
}
//# sourceMappingURL=network.js.map