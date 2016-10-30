"use strict";
var ApiEdgeQueryType_1 = require('./ApiEdgeQueryType');
var ApiEdgeQueryContext_1 = require("./ApiEdgeQueryContext");
var ApiEdgeQuery = (function () {
    function ApiEdgeQuery(edge, type, context, body) {
        var _this = this;
        if (type === void 0) { type = ApiEdgeQueryType_1.ApiEdgeQueryType.Get; }
        if (context === void 0) { context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext(); }
        if (body === void 0) { body = null; }
        this.execute = function () {
            switch (_this.type) {
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Get:
                    return _this.edge.getEntry(_this.context);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Exists:
                    return _this.edge.exists(_this.context);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Create:
                    return _this.edge.createEntry(_this.context, _this.body);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Delete:
                    return _this.edge.removeEntry(_this.context, _this.body);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Update:
                    return _this.edge.updateEntry(_this.context, _this.body);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Patch:
                    return _this.edge.patchEntry(_this.context, _this.body);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.List:
                    return _this.edge.listEntries(_this.context);
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