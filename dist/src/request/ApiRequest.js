"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ApiEdgeQueryContext_1 = require("../edge/ApiEdgeQueryContext");
var PathSegment = (function () {
    function PathSegment() {
        this.inspect = function () {
            return '';
        };
    }
    return PathSegment;
}());
exports.PathSegment = PathSegment;
var MethodPathSegment = (function (_super) {
    __extends(MethodPathSegment, _super);
    function MethodPathSegment(edge, method) {
        var _this = this;
        _super.call(this);
        this.inspect = function () {
            return "call{" + _this.method.name + "}";
        };
        this.edge = edge;
        this.method = method;
    }
    return MethodPathSegment;
}(PathSegment));
exports.MethodPathSegment = MethodPathSegment;
var EdgePathSegment = (function (_super) {
    __extends(EdgePathSegment, _super);
    function EdgePathSegment(edge, relation) {
        var _this = this;
        _super.call(this);
        this.inspect = function () {
            return "[" + _this.edge.name + "]";
        };
        this.edge = edge;
        this.relation = relation;
    }
    return EdgePathSegment;
}(PathSegment));
exports.EdgePathSegment = EdgePathSegment;
var EntryPathSegment = (function (_super) {
    __extends(EntryPathSegment, _super);
    function EntryPathSegment(edge, id, relation) {
        var _this = this;
        _super.call(this);
        this.inspect = function () {
            return _this.edge.name + "(" + _this.id + ")";
        };
        this.edge = edge;
        this.relation = relation;
        this.id = id;
    }
    return EntryPathSegment;
}(PathSegment));
exports.EntryPathSegment = EntryPathSegment;
var RelatedFieldPathSegment = (function (_super) {
    __extends(RelatedFieldPathSegment, _super);
    function RelatedFieldPathSegment(edge, relation) {
        var _this = this;
        _super.call(this);
        this.inspect = function () {
            return _this.edge.name + "." + _this.relation.name;
        };
        this.edge = edge;
        this.relation = relation;
    }
    return RelatedFieldPathSegment;
}(PathSegment));
exports.RelatedFieldPathSegment = RelatedFieldPathSegment;
var ApiRequestPath = (function () {
    function ApiRequestPath() {
        var _this = this;
        this.segments = [];
        this.add = function (segment) {
            _this.segments.push(segment);
        };
        this.inspect = function () {
            return _this.segments.map(function (segment) { return segment.inspect(); }).join(' -> ');
        };
    }
    return ApiRequestPath;
}());
exports.ApiRequestPath = ApiRequestPath;
(function (ApiRequestType) {
    ApiRequestType[ApiRequestType["Create"] = 1] = "Create";
    ApiRequestType[ApiRequestType["Read"] = 2] = "Read";
    ApiRequestType[ApiRequestType["Update"] = 4] = "Update";
    ApiRequestType[ApiRequestType["Patch"] = 8] = "Patch";
    ApiRequestType[ApiRequestType["Delete"] = 16] = "Delete";
    ApiRequestType[ApiRequestType["Exists"] = 32] = "Exists";
    ApiRequestType[ApiRequestType["Any"] = 63] = "Any";
    ApiRequestType[ApiRequestType["Change"] = 13] = "Change";
})(exports.ApiRequestType || (exports.ApiRequestType = {}));
var ApiRequestType = exports.ApiRequestType;
var ApiRequest = (function () {
    function ApiRequest() {
        this.body = null;
        this.path = new ApiRequestPath();
        this.type = ApiRequestType.Read;
        this.context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext();
    }
    return ApiRequest;
}());
exports.ApiRequest = ApiRequest;
//# sourceMappingURL=ApiRequest.js.map