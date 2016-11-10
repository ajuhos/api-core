"use strict";
var parse = require('obj-parse'), deepKeys = require('deep-keys');
var ApiEdgeSchema = (function () {
    function ApiEdgeSchema(schema) {
        var _this = this;
        this.fields = deepKeys(schema);
        this.transformations = {};
        this.fields.forEach(function (field) { return _this.transformations[field] = parse(field)(schema); });
    }
    return ApiEdgeSchema;
}());
exports.ApiEdgeSchema = ApiEdgeSchema;
//# sourceMappingURL=ApiEdgeSchema.js.map