"use strict";
var ApiEdgeQueryFilter_1 = require("./ApiEdgeQueryFilter");
var ApiEdgeQueryContext = (function () {
    function ApiEdgeQueryContext(id, fields) {
        var _this = this;
        if (id === void 0) { id = null; }
        if (fields === void 0) { fields = []; }
        this.fields = [];
        this.populatedFields = [];
        this.sortBy = [];
        this.filters = [];
        this.clone = function () {
            var temp = new ApiEdgeQueryContext();
            temp.id = _this.id;
            _this.fields.forEach(function (f) { return temp.fields.push(f); });
            _this.populatedFields.forEach(function (f) { return temp.populatedFields.push(f); });
            _this.filters.forEach(function (f) { return temp.filters.push(f.clone()); });
            _this.sortBy.forEach(function (f) { return temp.sortBy.push([f[0], f[1]]); });
            if (_this.pagination) {
                temp.pagination = {
                    skip: _this.pagination.skip,
                    limit: _this.pagination.limit
                };
            }
            return temp;
        };
        this.paginate = function (skip, limit) {
            _this.pagination = {
                skip: skip, limit: limit
            };
            return _this;
        };
        this.sort = function (fieldName, ascending) {
            if (ascending === void 0) { ascending = true; }
            _this.sortBy.push([fieldName, (ascending ? 1 : -1)]);
            return _this;
        };
        this.id = id;
        this.fields = fields;
    }
    ApiEdgeQueryContext.prototype.populate = function (field) {
        this.populatedFields.push(field);
        return this;
    };
    ApiEdgeQueryContext.prototype.field = function (field) {
        this.fields.push(field);
        return this;
    };
    ApiEdgeQueryContext.prototype.filter = function (field, type, value) {
        this.filters.push(new ApiEdgeQueryFilter_1.ApiEdgeQueryFilter(field, type, value));
        return this;
    };
    return ApiEdgeQueryContext;
}());
exports.ApiEdgeQueryContext = ApiEdgeQueryContext;
//# sourceMappingURL=ApiEdgeQueryContext.js.map