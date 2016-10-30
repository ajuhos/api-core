"use strict";
(function (ApiEdgeMethodScope) {
    ApiEdgeMethodScope[ApiEdgeMethodScope["Edge"] = 0] = "Edge";
    ApiEdgeMethodScope[ApiEdgeMethodScope["Entry"] = 1] = "Entry";
    ApiEdgeMethodScope[ApiEdgeMethodScope["Collection"] = 2] = "Collection";
})(exports.ApiEdgeMethodScope || (exports.ApiEdgeMethodScope = {}));
var ApiEdgeMethodScope = exports.ApiEdgeMethodScope;
var ApiEdgeMethod = (function () {
    function ApiEdgeMethod(name, execute, scope) {
        if (scope === void 0) { scope = ApiEdgeMethodScope.Edge; }
        this.scope = ApiEdgeMethodScope.Edge;
        this.name = name;
        this.scope = scope;
        this.execute = execute;
    }
    return ApiEdgeMethod;
}());
exports.ApiEdgeMethod = ApiEdgeMethod;
//# sourceMappingURL=ApiEdgeMethod.js.map