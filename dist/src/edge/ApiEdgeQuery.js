"use strict";
var ApiEdgeQueryType_1 = require('./ApiEdgeQueryType');
var ApiEdgeQueryContext_1 = require("./ApiEdgeQueryContext");
var ApiEdgeError_1 = require("../query/ApiEdgeError");
var ApiEdgeQuery = (function () {
    function ApiEdgeQuery(edge, type, context, body) {
        var _this = this;
        if (type === void 0) { type = ApiEdgeQueryType_1.ApiEdgeQueryType.Get; }
        if (context === void 0) { context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext(); }
        if (body === void 0) { body = null; }
        this.originalFields = [];
        this.applySchemaOnInputItem = function (item) {
            var output = {};
            _this.edge.schema.transformations.forEach(function (transformation) {
                if (transformation.parsedField(item) !== undefined)
                    transformation.applyToInput(item, output);
            });
            return output;
        };
        this.applySchemaOnItem = function (item) {
            var output = {};
            if (_this.originalFields.length) {
                _this.edge.schema.transformations.forEach(function (transformation) {
                    if (_this.originalFields.indexOf(transformation.affectedSchemaField) != -1)
                        transformation.applyToOutput(item, output);
                });
            }
            else {
                _this.edge.schema.transformations.forEach(function (transformation) {
                    transformation.applyToOutput(item, output);
                });
            }
            return output;
        };
        this.applyListSchema = function (value) {
            if (!_this.edge.schema)
                return value;
            value.data = value.data.map(function (item) { return _this.applySchemaOnItem(item); });
            return value;
        };
        this.applyInputSchema = function (value) {
            if (!_this.edge.schema)
                return value;
            return _this.applySchemaOnInputItem(value);
        };
        this.applySchema = function (value) {
            if (!_this.edge.schema)
                return value;
            value.data = _this.applySchemaOnItem(value.data);
            return value;
        };
        this.execute = function () {
            if (_this.context.fields.length) {
                _this.originalFields = _this.context.fields;
                _this.context.fields = _this.edge.schema.transformFields(_this.context.fields);
                _this.context.filters.forEach(function (filter) { return filter.field = _this.edge.schema.transformField(filter.field); });
            }
            if (_this.body) {
                _this.body = _this.applyInputSchema(_this.body);
            }
            switch (_this.type) {
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Get:
                    return _this.edge.getEntry(_this.context).then(_this.applySchema);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Exists:
                    return _this.edge.exists(_this.context);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Create:
                    return _this.edge.createEntry(_this.context, _this.body).then(_this.applySchema);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Delete:
                    return _this.edge.removeEntry(_this.context, _this.body).then(_this.applySchema);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Update:
                    return _this.edge.updateEntry(_this.context, _this.body).then(_this.applySchema);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Patch:
                    return _this.edge.patchEntry(_this.context, _this.body).then(_this.applySchema);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.List:
                    return _this.edge.listEntries(_this.context).then(_this.applyListSchema);
                default:
                    throw new ApiEdgeError_1.ApiEdgeError(500, "Unsupported Query Type");
            }
        };
        this.edge = edge;
        this.type = type;
        this.context = context;
        this.body = body;
    }
    return ApiEdgeQuery;
}());
exports.ApiEdgeQuery = ApiEdgeQuery;
//# sourceMappingURL=ApiEdgeQuery.js.map