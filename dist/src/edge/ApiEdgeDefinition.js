"use strict";
var ApiEdgeMethod_1 = require("./ApiEdgeMethod");
var ApiEdge = (function () {
    function ApiEdge() {
        var _this = this;
        this.fields = [];
        this.methods = [];
        this.relations = [];
        this.edgeMethod = function (name, execute) {
            if (_this.methods.find(function (method) {
                return method.name === name;
            }))
                throw "A method with the same name already exists.";
            _this.methods.push(new ApiEdgeMethod_1.ApiEdgeMethod(name, execute, ApiEdgeMethod_1.ApiEdgeMethodScope.Edge));
            return _this;
        };
        this.collectionMethod = function (name, execute) {
            if (_this.methods.find(function (method) {
                return method.name === name &&
                    (method.scope == ApiEdgeMethod_1.ApiEdgeMethodScope.Collection || method.scope == ApiEdgeMethod_1.ApiEdgeMethodScope.Edge);
            }))
                throw "A collection method with the same name already exists.";
            _this.methods.push(new ApiEdgeMethod_1.ApiEdgeMethod(name, execute, ApiEdgeMethod_1.ApiEdgeMethodScope.Collection));
            return _this;
        };
        this.entryMethod = function (name, execute) {
            if (_this.methods.find(function (method) {
                return method.name === name &&
                    (method.scope == ApiEdgeMethod_1.ApiEdgeMethodScope.Entry || method.scope == ApiEdgeMethod_1.ApiEdgeMethodScope.Edge);
            }))
                throw "An entry method with the same name already exists.";
            _this.methods.push(new ApiEdgeMethod_1.ApiEdgeMethod(name, execute, ApiEdgeMethod_1.ApiEdgeMethodScope.Entry));
            return _this;
        };
    }
    return ApiEdge;
}());
exports.ApiEdge = ApiEdge;
//# sourceMappingURL=ApiEdgeDefinition.js.map