"use strict";
var parse = require('obj-parse'), deepKeys = require('deep-keys');
var ApiEdgeSchema = (function () {
    function ApiEdgeSchema(schema) {
        this.fields = deepKeys(schema);
        this.transformations = this.fields.map(function (field) {
            var parsedField = parse(field);
            return {
                value: parsedField,
                apply: ApiEdgeSchema.createTransformer(parsedField(schema))
            };
        });
    }
    ApiEdgeSchema.createTransformer = function (transform) {
        if (typeof transform === "function")
            return transform;
        else if (transform === "=")
            return function (a) { return a; };
        else
            throw "Not Supported Transform";
    };
    return ApiEdgeSchema;
}());
exports.ApiEdgeSchema = ApiEdgeSchema;
//# sourceMappingURL=ApiEdgeSchema.js.map