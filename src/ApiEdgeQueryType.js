"use strict";
/**
 * Possible types for API Edge Queries.
 */
(function (ApiEdgeQueryType) {
    /**
     * List several entities of the source model.
     */
    ApiEdgeQueryType[ApiEdgeQueryType["List"] = 0] = "List";
    /**
     * Get an entity of the source model.
     */
    ApiEdgeQueryType[ApiEdgeQueryType["Get"] = 1] = "Get";
    /**
     * Create a new entity in the source model.
     */
    ApiEdgeQueryType[ApiEdgeQueryType["Create"] = 2] = "Create";
    /**
     * Edit an entity in the source model.
     */
    ApiEdgeQueryType[ApiEdgeQueryType["Update"] = 3] = "Update";
    /**
     * Delete an entity from the source model.
     */
    ApiEdgeQueryType[ApiEdgeQueryType["Delete"] = 4] = "Delete";
    /**
     * Call a method in the provider.
     */
    ApiEdgeQueryType[ApiEdgeQueryType["Call"] = 5] = "Call";
})(exports.ApiEdgeQueryType || (exports.ApiEdgeQueryType = {}));
var ApiEdgeQueryType = exports.ApiEdgeQueryType;
//# sourceMappingURL=ApiEdgeQueryType.js.map