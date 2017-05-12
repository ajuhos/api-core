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
        this.execute = function (identity) {
            if (identity === void 0) { identity = null; }
            return new Promise(function (resolve, reject) {
                var next = function (scope) {
                    var step = _this.steps[scope.step];
                    if (step) {
                        scope.step++;
                        if (scope.step < _this.steps.length) {
                            step.execute(scope).then(next).catch(reject);
                        }
                        else {
                            step.execute(scope).then(function (scope) { return resolve(scope.response || new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(null)); }).catch(reject);
                        }
                    }
                };
                next({
                    context: new ApiEdgeQueryContext_1.ApiEdgeQueryContext(),
                    body: null,
                    request: _this.request,
                    response: null,
                    query: _this,
                    step: 0,
                    identity: identity
                });
            });
        };
    }
    return ApiQuery;
}());
exports.ApiQuery = ApiQuery;
//# sourceMappingURL=ApiQuery.js.map