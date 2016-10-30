"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ApiEdgeDefinition_1 = require("../../../src/edge/ApiEdgeDefinition");
var ApiEdgeQueryFilter_1 = require("../../../src/edge/ApiEdgeQueryFilter");
var ApiEdgeQueryResponse_1 = require("../../../src/edge/ApiEdgeQueryResponse");
var ApiEdgeError_1 = require("../../../src/query/ApiEdgeError");
var Model = (function () {
    function Model(obj) {
        this.id = obj.id;
    }
    return Model;
}());
exports.Model = Model;
var ModelEdge = (function (_super) {
    __extends(ModelEdge, _super);
    function ModelEdge() {
        var _this = this;
        _super.apply(this, arguments);
        this.name = "entry";
        this.pluralName = "entries";
        this.idField = "id";
        this.fields = [];
        this.provider = [];
        this.methods = [];
        this.relations = [];
        this.inspect = function () { return ("/" + _this.pluralName); };
        this.getEntry = function (context) {
            return new Promise(function (resolve, reject) {
                var entry = _this.provider.find(function (s) { return s.id === context.id && _this.applyFilters(s, context.filters); });
                if (entry)
                    resolve(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(_this.applyMapping(entry, context.fields)));
                else
                    reject(new ApiEdgeError_1.ApiEdgeError(404, "Not Found"));
            });
        };
        this.listEntries = function (context) {
            return new Promise(function (resolve) {
                resolve(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(_this.provider
                    .filter(function (item) { return _this.applyFilters(item, context.filters); })
                    .map(function (entry) { return _this.applyMapping(entry, context.fields); })));
            });
        };
        this.createEntry = function (context, body) {
            return new Promise(function (resolve) {
                var entry = _this.createModel(body);
                _this.provider.push(entry);
                resolve(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(_this.applyMapping(entry, context.fields)));
            });
        };
        this.updateEntry = function (context, body) {
            return new Promise(function (resolve, reject) {
                _this.getEntry(context).then(function () {
                    body.id = context.id;
                    resolve(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(_this.applyMapping(body, context.fields)));
                }).catch(reject);
            });
        };
        this.patchEntry = function (context, body) {
            return new Promise(function (resolve, reject) {
                _this.getEntry(context).then(function (resp) {
                    var entry = resp.data;
                    Object.keys(body).forEach(function (key) { return entry[key] = body[key]; });
                    resolve(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(_this.applyMapping(entry, context.fields)));
                }).catch(reject);
            });
        };
        this.removeEntry = function (context) {
            return new Promise(function (resolve, reject) {
                _this.getEntry(context).then(function (entry) {
                    _this.provider.splice(_this.provider.indexOf(entry), 1);
                    resolve(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(entry));
                }).catch(reject);
            });
        };
        this.exists = function (context) {
            return new Promise(function (resolve) {
                var entry = _this.provider.find(function (s) { return s.id === context.id; });
                if (entry)
                    resolve(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(true));
                else
                    resolve(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(false));
            });
        };
        this.callMethod = function (scope) {
            return _this.methods["" + scope.context.id](scope);
        };
    }
    ModelEdge.prototype.applyMapping = function (item, fields) {
        if (!fields.length)
            return item;
        var output = {};
        Object.keys(item).filter(function (key) { return fields.indexOf(key) != -1; }).forEach(function (key) { return output[key] = item[key]; });
        return output;
    };
    ModelEdge.applyFilter = function (item, filter) {
        switch (filter.type) {
            case ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.Equals:
                return item[filter.field] === filter.value;
            case ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.NotEquals:
                return item[filter.field] !== filter.value;
            case ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.GreaterThan:
                return item[filter.field] > filter.value;
            case ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.GreaterThanOrEquals:
                return item[filter.field] >= filter.value;
            case ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.LowerThan:
                return item[filter.field] < filter.value;
            case ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.LowerThanOrEquals:
                return item[filter.field] <= filter.value;
            default:
                return false;
        }
    };
    ModelEdge.prototype.applyFilters = function (item, filters) {
        if (!filters.length)
            return true;
        return filters.every(function (filter) { return ModelEdge.applyFilter(item, filter); });
    };
    return ModelEdge;
}(ApiEdgeDefinition_1.ApiEdge));
exports.ModelEdge = ModelEdge;
//# sourceMappingURL=ModelEdge.js.map