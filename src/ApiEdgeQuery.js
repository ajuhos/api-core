/**
 * Created by ajuhos on 2016. 10. 20..
 */
"use strict";
const ApiEdgeQueryType_1 = require('./ApiEdgeQueryType');
class ApiEdgeQuery {
    /**
     * Create a new API Edge Query for the specified API Edge with the specified parameters.
     * @param {ApiEdgeDefinition} edge
     * @param {ApiEdgeQueryType} type
     * @param {Array} parameters
     */
    constructor(edge, type = ApiEdgeQueryType_1.ApiEdgeQueryType.Get, ...parameters = []) {
        this.edge = edge;
        this.type = type;
        this.parameters = parameters;
    }
}
exports.ApiEdgeQuery = ApiEdgeQuery;
//# sourceMappingURL=ApiEdgeQuery.js.map