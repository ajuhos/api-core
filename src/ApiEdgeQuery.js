/**
 * Created by ajuhos on 2016. 10. 20..
 */
"use strict";
var ApiEdgeQueryType_1 = require('./ApiEdgeQueryType');
var QueryContext = (function () {
    function QueryContext(parameters) {
        var _this = this;
        parameters.forEach(function (param) {
            if (param.id)
                _this.id = param.id;
        });
    }
    return QueryContext;
}());
var ApiEdgeQuery = (function () {
    /**
     * Create a new API Edge Query for the specified API Edge with the specified parameters.
     * @param {ApiEdgeDefinition} edge
     * @param {ApiEdgeQueryType} type
     * @param {Array} parameters
     */
    function ApiEdgeQuery(edge, type) {
        var _this = this;
        if (type === void 0) { type = ApiEdgeQueryType_1.ApiEdgeQueryType.Get; }
        var parameters = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            parameters[_i - 2] = arguments[_i];
        }
        this.execute = function () {
            var context = new QueryContext(_this.parameters);
            switch (_this.type) {
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Get:
                    return _this.edge.getEntry(context.id);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Exists:
                    return _this.edge.exists(context.id);
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Create:
                    //TODO
                    break;
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Delete:
                    //TODO
                    break;
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Update:
                    //TODO
                    break;
                case ApiEdgeQueryType_1.ApiEdgeQueryType.List:
                    //TODO
                    break;
                case ApiEdgeQueryType_1.ApiEdgeQueryType.Call:
                    //TODO
                    break;
            }
        };
        this.edge = edge;
        this.type = type;
        this.parameters = parameters;
    }
    return ApiEdgeQuery;
}());
exports.ApiEdgeQuery = ApiEdgeQuery;
