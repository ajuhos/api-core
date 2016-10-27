"use strict";
var ApiEdgeQueryContext_1 = require("../edge/ApiEdgeQueryContext");
var ApiEdgeQueryResponse_1 = require("../edge/ApiEdgeQueryResponse");
var ApiQuery = (function () {
    function ApiQuery() {
        var _this = this;
        this.steps = [];
        this.unshift = function (step) {
            _this.steps.unshift(step);
            return _this;
        };
        this.push = function (step) {
            _this.steps.push(step);
            return _this;
        };
        this.execute = function () {
            return new Promise(function (resolve, reject) {
                var next = function (scope) {
                    var step = _this.steps.shift();
                    if (step) {
                        if (_this.steps.length) {
                            step.execute(scope).then(next).catch(reject);
                        }
                        else {
                            step.execute(scope).then(function (scope) { return resolve(scope.response || new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(null)); }).catch(reject);
                        }
                    }
                };
                next({ context: new ApiEdgeQueryContext_1.ApiEdgeQueryContext(), response: null });
            });
        };
    }
    return ApiQuery;
}());
exports.ApiQuery = ApiQuery;
//# sourceMappingURL=ApiQuery.js.map