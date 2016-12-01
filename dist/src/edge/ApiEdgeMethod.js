"use strict";
var ApiRequest_1 = require("../request/ApiRequest");
(function (ApiEdgeMethodScope) {
    ApiEdgeMethodScope[ApiEdgeMethodScope["Edge"] = 0] = "Edge";
    ApiEdgeMethodScope[ApiEdgeMethodScope["Entry"] = 1] = "Entry";
    ApiEdgeMethodScope[ApiEdgeMethodScope["Collection"] = 2] = "Collection";
})(exports.ApiEdgeMethodScope || (exports.ApiEdgeMethodScope = {}));
var ApiEdgeMethodScope = exports.ApiEdgeMethodScope;
var ApiEdgeMethod = (function () {
    function ApiEdgeMethod(name, execute, scope, acceptedTypes) {
        if (scope === void 0) { scope = ApiEdgeMethodScope.Edge; }
        if (acceptedTypes === void 0) { acceptedTypes = ApiRequest_1.ApiRequestType.Any; }
        this.acceptedTypes = ApiRequest_1.ApiRequestType.Any;
        this.scope = ApiEdgeMethodScope.Edge;
        this.name = name;
        this.scope = scope;
        this.execute = execute;
        this.acceptedTypes = acceptedTypes;
    }
    return ApiEdgeMethod;
}());
exports.ApiEdgeMethod = ApiEdgeMethod;
//# sourceMappingURL=ApiEdgeMethod.js.map