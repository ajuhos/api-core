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
        this.applySchemaOnItem = function (item) {
            _this.edge.schema.transformations.forEach(function (transformation) {
                return transformation.value.assign(item, transformation.apply(transformation.value(item), item));
            });
            return item;
        };
        this.applyListSchema = function (value) {
            if (!_this.edge.schema)
                return value;
            value.data = value.data.map(function (item) { return _this.applySchemaOnItem(item); });
            return value;
        };
        this.applySchema = function (value) {
            if (!_this.edge.schema)
                return value;
            value.data = _this.applySchemaOnItem(value.data);
            return value;
        };
        this.execute = function () {
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