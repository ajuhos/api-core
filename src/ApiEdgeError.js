"use strict";
var ApiEdgeError = (function () {
    function ApiEdgeError(status, message) {
        this.status = status;
        this.message = message;
    }
    return ApiEdgeError;
}());
exports.ApiEdgeError = ApiEdgeError;
