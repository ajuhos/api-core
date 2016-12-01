"use strict";
(function (ApiEdgeQueryType) {
    ApiEdgeQueryType[ApiEdgeQueryType["List"] = 2] = "List";
    ApiEdgeQueryType[ApiEdgeQueryType["Get"] = 4] = "Get";
    ApiEdgeQueryType[ApiEdgeQueryType["Create"] = 8] = "Create";
    ApiEdgeQueryType[ApiEdgeQueryType["Update"] = 16] = "Update";
    ApiEdgeQueryType[ApiEdgeQueryType["Patch"] = 32] = "Patch";
    ApiEdgeQueryType[ApiEdgeQueryType["Delete"] = 64] = "Delete";
    ApiEdgeQueryType[ApiEdgeQueryType["Exists"] = 128] = "Exists";
    ApiEdgeQueryType[ApiEdgeQueryType["Any"] = 254] = "Any";
    ApiEdgeQueryType[ApiEdgeQueryType["Change"] = 48] = "Change";
    ApiEdgeQueryType[ApiEdgeQueryType["Read"] = 132] = "Read";
    ApiEdgeQueryType[ApiEdgeQueryType["ReadOrChange"] = 180] = "ReadOrChange";
})(exports.ApiEdgeQueryType || (exports.ApiEdgeQueryType = {}));
var ApiEdgeQueryType = exports.ApiEdgeQueryType;
//# sourceMappingURL=ApiEdgeQueryType.js.map