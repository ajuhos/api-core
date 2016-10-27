"use strict";
(function (ApiEdgeQueryFilterType) {
    ApiEdgeQueryFilterType[ApiEdgeQueryFilterType["Equals"] = 0] = "Equals";
    ApiEdgeQueryFilterType[ApiEdgeQueryFilterType["GreaterThanOrEquals"] = 1] = "GreaterThanOrEquals";
    ApiEdgeQueryFilterType[ApiEdgeQueryFilterType["GreaterThan"] = 2] = "GreaterThan";
    ApiEdgeQueryFilterType[ApiEdgeQueryFilterType["LowerThanOrEquals"] = 3] = "LowerThanOrEquals";
    ApiEdgeQueryFilterType[ApiEdgeQueryFilterType["LowerThan"] = 4] = "LowerThan";
    ApiEdgeQueryFilterType[ApiEdgeQueryFilterType["NotEquals"] = 5] = "NotEquals";
})(exports.ApiEdgeQueryFilterType || (exports.ApiEdgeQueryFilterType = {}));
var ApiEdgeQueryFilterType = exports.ApiEdgeQueryFilterType;
var ApiEdgeQueryFilter = (function () {
    function ApiEdgeQueryFilter(field, type, value) {
        var _this = this;
        this.clone = function () { return new ApiEdgeQueryFilter(_this.field, _this.type, _this.value); };
        this.field = field;
        this.value = value;
        this.type = type;
    }
    return ApiEdgeQueryFilter;
}());
exports.ApiEdgeQueryFilter = ApiEdgeQueryFilter;
