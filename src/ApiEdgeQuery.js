/**
 * Created by ajuhos on 2016. 10. 20..
 */
"use strict";
var ApiEdgeQueryType_1 = require('./ApiEdgeQueryType');
var ApiEdgeQuery = (function () {
    /**
     * Create a new API Edge Query for the specified API Edge with the specified parameters.
     * @param {ApiEdgeDefinition} edge
     * @param {ApiEdgeQueryType} type
     * @param {Array} parameters
     */
    function ApiEdgeQuery(edge, type) {
        if (type === void 0) { type = ApiEdgeQueryType_1.ApiEdgeQueryType.Get; }
        var parameters = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            parameters[_i - 2] = arguments[_i];
        }
        this.edge = edge;
        this.type = type;
        this.parameters = parameters;
    }
    return ApiEdgeQuery;
}());
exports.ApiEdgeQuery = ApiEdgeQuery;
