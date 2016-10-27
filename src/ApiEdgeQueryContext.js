"use strict";
var ApiEdgeQueryFilter_1 = require("./ApiEdgeQueryFilter");
var ApiEdgeQueryContext = (function () {
    function ApiEdgeQueryContext(id, fields) {
        var _this = this;
        if (id === void 0) { id = null; }
        if (fields === void 0) { fields = []; }
        this.fields = [];
        this.filters = [];
        this.paginate = function (skip, limit) {
            _this.pagination = {
                skip: skip, limit: limit
            };
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
