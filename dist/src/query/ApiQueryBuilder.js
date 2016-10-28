"use strict";
var ApiQuery_1 = require("./ApiQuery");
var ApiEdgeQuery_1 = require("../edge/ApiEdgeQuery");
var ApiEdgeQueryContext_1 = require("../edge/ApiEdgeQueryContext");
var ApiEdgeError_1 = require("./ApiEdgeError");
var ApiEdgeQueryFilter_1 = require("../edge/ApiEdgeQueryFilter");
var ApiRequest_1 = require("../request/ApiRequest");
var ApiEdgeQueryResponse_1 = require("../edge/ApiEdgeQueryResponse");
var ApiEdgeQueryType_1 = require("../edge/ApiEdgeQueryType");
var OneToOneRelation_1 = require("../relations/OneToOneRelation");
var QueryEdgeQueryStep = (function () {
    function QueryEdgeQueryStep(query) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve, reject) {
                _this.query.body = scope.body;
                _this.query.context = scope.context;
                _this.query.execute().then(function (response) {
                    scope.context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext();
                    scope.response = response;
                    resolve(scope);
                }).catch(reject);
            });
        };
        this.inspect = function () { return ("QUERY /" + _this.query.edge.pluralName); };
        this.query = query;
    }
    return QueryEdgeQueryStep;
}());
var RelateQueryStep = (function () {
    function RelateQueryStep(relation) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve, reject) {
                if (!scope.response)
                    return reject(new ApiEdgeError_1.ApiEdgeError(404, "Missing Related Entry"));
                scope.context.filter(_this.relation.relationId, ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.Equals, scope.response.data.id);
                resolve(scope);
            });
        };
        this.inspect = function () { return ("RELATE " + _this.relation.relationId); };
        this.relation = relation;
    }
    return RelateQueryStep;
}());
var CheckResponseQueryStep = (function () {
    function CheckResponseQueryStep() {
        this.execute = function (scope) {
            return new Promise(function (resolve, reject) {
                if (!scope.response)
                    return reject(new ApiEdgeError_1.ApiEdgeError(404, "Missing Related Entry"));
                resolve(scope);
            });
        };
        this.inspect = function () { return "CHECK"; };
    }
    return CheckResponseQueryStep;
}());
var NotImplementedQueryStep = (function () {
    function NotImplementedQueryStep(description) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve) {
                resolve(scope);
            });
        };
        this.inspect = function () { return ("NOT IMPLEMENTED: " + _this.description); };
        this.description = description;
    }
    return NotImplementedQueryStep;
}());
var SetResponseQueryStep = (function () {
    function SetResponseQueryStep(response) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve) {
                scope.response = _this.response;
                scope.context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext();
                resolve(scope);
            });
        };
        this.inspect = function () { return "SET RESPONSE"; };
        this.response = response;
    }
    return SetResponseQueryStep;
}());
var SetBodyQueryStep = (function () {
    function SetBodyQueryStep(body) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve) {
                scope.body = _this.body;
                resolve(scope);
            });
        };
        this.inspect = function () { return "SET BODY"; };
        this.body = body;
    }
    return SetBodyQueryStep;
}());
var ProvideIdQueryStep = (function () {
    function ProvideIdQueryStep(fieldName) {
        var _this = this;
        if (fieldName === void 0) { fieldName = "id"; }
        this.execute = function (scope) {
            return new Promise(function (resolve, reject) {
                if (!scope.response)
                    return reject(new ApiEdgeError_1.ApiEdgeError(404, "Missing Entry"));
                scope.context.id = scope.response.data[_this.fieldName];
                resolve(scope);
            });
        };
        this.inspect = function () { return ("PROVIDE ID: " + _this.fieldName); };
        this.fieldName = fieldName;
    }
    return ProvideIdQueryStep;
}());
var ExtendContextQueryStep = (function () {
    function ExtendContextQueryStep(context) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve) {
                scope.context.id = _this.context.id || scope.context.id;
                if (_this.context.pagination) {
                    scope.context.pagination = _this.context.pagination;
                }
                _this.context.fields.forEach(function (f) { return scope.context.fields.push(f); });
                _this.context.populatedFields.forEach(function (f) { return scope.context.populatedFields.push(f); });
                _this.context.filters.forEach(function (f) { return scope.context.filters.push(f); });
                _this.context.sortBy.forEach(function (f) { return scope.context.sortBy.push(f); });
                resolve(scope);
            });
        };
        this.inspect = function () {
            if (_this.context.id) {
                return "EXTEND CONTEXT (id=" + _this.context.id + ")";
            }
            else {
                return "APPLY PARAMETERS";
            }
        };
        this.context = context;
    }
    return ExtendContextQueryStep;
}());
var GenericQueryStep = (function () {
    function GenericQueryStep(description, step, context) {
        var _this = this;
        this.execute = function (scope) {
            return _this.step.apply(_this.context, [scope]);
        };
        this.inspect = function () { return _this.description; };
        this.description = description;
        this.step = step;
        this.context = context;
    }
    return GenericQueryStep;
}());
var ApiQueryBuilder = (function () {
    function ApiQueryBuilder(api) {
        var _this = this;
        this.buildReadQuery = function (request) {
            var query = new ApiQuery_1.ApiQuery();
            var segments = request.path.segments, lastSegment = segments[segments.length - 1];
            var baseQuery;
            if (lastSegment instanceof ApiRequest_1.EdgePathSegment) {
                baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.List);
            }
            else if (lastSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
                baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.relation.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Get);
            }
            else {
                baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Get);
            }
            query.unshift(new QueryEdgeQueryStep(baseQuery));
            query.unshift(new ExtendContextQueryStep(request.context));
            if (lastSegment instanceof ApiRequest_1.EntryPathSegment) {
                query.unshift(new ExtendContextQueryStep(new ApiEdgeQueryContext_1.ApiEdgeQueryContext(lastSegment.id)));
            }
            else if (lastSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
                query.unshift(new ProvideIdQueryStep(lastSegment.relation.relationId));
            }
            else {
            }
            var readMode = true;
            for (var i = segments.length - 2; i >= 0; i--) {
                var currentSegment = segments[i];
                var relation = segments[i + 1].relation;
                if (relation && !(relation instanceof OneToOneRelation_1.OneToOneRelation)) {
                    query.unshift(new RelateQueryStep(relation));
                }
                if (readMode) {
                    readMode = _this.buildReadStep(query, currentSegment);
                }
                else {
                    readMode = _this.buildCheckStep(query, currentSegment);
                }
            }
            return query;
        };
        this.buildChangeQuery = function (request) {
            var query = new ApiQuery_1.ApiQuery();
            var segments = request.path.segments, lastSegment = segments[segments.length - 1];
            var baseQuery;
            if (lastSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
                throw new ApiEdgeError_1.ApiEdgeError(500, "Not Implemented");
            }
            else {
                if (request.type === ApiRequest_1.ApiRequestType.Update) {
                    baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Update);
                }
                else {
                    baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Delete);
                }
            }
            query.unshift(new QueryEdgeQueryStep(baseQuery));
            if (request.body)
                query.unshift(new SetBodyQueryStep(request.body));
            query.unshift(new ExtendContextQueryStep(request.context));
            if (lastSegment instanceof ApiRequest_1.EntryPathSegment) {
                query.unshift(new ExtendContextQueryStep(new ApiEdgeQueryContext_1.ApiEdgeQueryContext(lastSegment.id)));
            }
            else if (lastSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
                query.unshift(new ProvideIdQueryStep(lastSegment.relation.relationId));
            }
            else {
            }
            var readMode = true;
            for (var i = segments.length - 2; i >= 0; i--) {
                var currentSegment = segments[i];
                var relation = segments[i + 1].relation;
                if (relation && !(relation instanceof OneToOneRelation_1.OneToOneRelation)) {
                    query.unshift(new RelateQueryStep(relation));
                }
                if (readMode) {
                    readMode = _this.buildReadStep(query, currentSegment);
                }
                else {
                    readMode = _this.buildCheckStep(query, currentSegment);
                }
            }
            return query;
        };
        this.buildCreateQuery = function (request) {
            var query = new ApiQuery_1.ApiQuery();
            var segments = request.path.segments, lastSegment = segments[segments.length - 1];
            if (segments.length != 1 || !(lastSegment instanceof ApiRequest_1.EdgePathSegment)) {
                throw new ApiEdgeError_1.ApiEdgeError(400, "Invalid Create Query");
            }
            query.unshift(new QueryEdgeQueryStep(new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Create)));
            query.unshift(new SetBodyQueryStep(request.body));
            return query;
        };
        this.build = function (request) {
            switch (request.type) {
                case ApiRequest_1.ApiRequestType.Read:
                    return _this.buildReadQuery(request);
                case ApiRequest_1.ApiRequestType.Update:
                case ApiRequest_1.ApiRequestType.Delete:
                    return _this.buildChangeQuery(request);
                case ApiRequest_1.ApiRequestType.Create:
                    return _this.buildCreateQuery(request);
                default:
                    throw new ApiEdgeError_1.ApiEdgeError(400, "Unsupported Query Type");
            }
        };
        this.api = api;
    }
    ApiQueryBuilder.prototype.buildProvideIdStep = function (query, currentSegment) {
        if (currentSegment instanceof ApiRequest_1.EntryPathSegment) {
            query.unshift(new ExtendContextQueryStep(new ApiEdgeQueryContext_1.ApiEdgeQueryContext(currentSegment.id)));
            return false;
        }
        else if (currentSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
            query.unshift(new ProvideIdQueryStep(currentSegment.relation.relationId));
            return true;
        }
        else {
            return false;
        }
    };
    ApiQueryBuilder.prototype.buildCheckStep = function (query, currentSegment) {
        if (currentSegment instanceof ApiRequest_1.EntryPathSegment) {
            query.unshift(new SetResponseQueryStep(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse({ id: currentSegment.id })));
            return false;
        }
        else if (currentSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
            query.unshift(new QueryEdgeQueryStep(new ApiEdgeQuery_1.ApiEdgeQuery(currentSegment.relation.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Get)));
        }
        else {
            return false;
        }
        return this.buildProvideIdStep(query, currentSegment);
    };
    ApiQueryBuilder.prototype.buildReadStep = function (query, currentSegment) {
        if (currentSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
            query.unshift(new QueryEdgeQueryStep(new ApiEdgeQuery_1.ApiEdgeQuery(currentSegment.relation.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Get)));
        }
        else {
            query.unshift(new QueryEdgeQueryStep(new ApiEdgeQuery_1.ApiEdgeQuery(currentSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Get)));
        }
        return this.buildProvideIdStep(query, currentSegment);
    };
    return ApiQueryBuilder;
}());
exports.ApiQueryBuilder = ApiQueryBuilder;
//# sourceMappingURL=ApiQueryBuilder.js.map