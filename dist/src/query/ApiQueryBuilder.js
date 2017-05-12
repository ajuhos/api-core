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
var Api_1 = require("../Api");
var ApiEdgeAction_1 = require("../edge/ApiEdgeAction");
var ApiAction_1 = require("./ApiAction");
var parse = require('obj-parse');
var EmbedQueryQueryStep = (function () {
    function EmbedQueryQueryStep(query, segment, request) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve, reject) {
                if (scope.response) {
                    var target_1 = scope.response.data;
                    if (Array.isArray(target_1)) {
                        var targetIndex_1 = {}, ids = [];
                        for (var _i = 0, target_2 = target_1; _i < target_2.length; _i++) {
                            var entry = target_2[_i];
                            var id = entry[_this.targetField];
                            if (targetIndex_1[id])
                                targetIndex_1[id].push(entry);
                            else
                                targetIndex_1[id] = [entry];
                            ids.push(id);
                        }
                        _this.request.context.filters = [
                            new ApiEdgeQueryFilter_1.ApiEdgeQueryFilter(_this.idField, ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.In, ids)
                        ];
                        _this.query.execute(scope.identity).then(function (response) {
                            for (var _i = 0, _a = response.data; _i < _a.length; _i++) {
                                var entry = _a[_i];
                                var id = entry[_this.idField];
                                for (var _b = 0, _c = targetIndex_1[id]; _b < _c.length; _b++) {
                                    var subEntry = _c[_b];
                                    subEntry[_this.targetField] = entry;
                                }
                            }
                            resolve(scope);
                        }).catch(reject);
                    }
                    else {
                        _this.segment.id = target_1[_this.targetField];
                        _this.query.execute(scope.identity).then(function (response) {
                            target_1[_this.targetField] = response.data;
                            resolve(scope);
                        }).catch(reject);
                    }
                }
                else
                    resolve(scope);
            });
        };
        this.inspect = function () { return ("EMBED QUERY /" + _this.targetField); };
        this.query = query;
        this.query.request = this.request = request;
        this.segment = segment;
        if (!this.segment.relation)
            throw new Error('Invalid relation provided.');
        this.targetField = this.segment.relation.name;
        this.idField = this.segment.relation.to.idField || Api_1.Api.defaultIdField;
    }
    return EmbedQueryQueryStep;
}());
exports.EmbedQueryQueryStep = EmbedQueryQueryStep;
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
exports.QueryEdgeQueryStep = QueryEdgeQueryStep;
var CallMethodQueryStep = (function () {
    function CallMethodQueryStep(method) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve, reject) {
                _this.method.execute(scope).then(function (response) {
                    scope.response = response;
                    resolve(scope);
                }).catch(reject);
            });
        };
        this.inspect = function () { return ("call{" + _this.method.name + "}"); };
        this.method = method;
    }
    return CallMethodQueryStep;
}());
exports.CallMethodQueryStep = CallMethodQueryStep;
var RelateQueryStep = (function () {
    function RelateQueryStep(relation) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve, reject) {
                if (!scope.response)
                    return reject(new ApiEdgeError_1.ApiEdgeError(404, "Missing Related Entry"));
                scope.context.filter(_this.relation.relationId, ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.Equals, scope.response.data[_this.relation.from.idField || Api_1.Api.defaultIdField]);
                resolve(scope);
            });
        };
        this.inspect = function () { return ("RELATE " + _this.relation.relationId); };
        this.relation = relation;
    }
    return RelateQueryStep;
}());
exports.RelateQueryStep = RelateQueryStep;
var RelateChangeQueryStep = (function () {
    function RelateChangeQueryStep(relation) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve, reject) {
                if (!scope.body)
                    return reject(new ApiEdgeError_1.ApiEdgeError(404, "Missing Body"));
                if (!scope.response)
                    return reject(new ApiEdgeError_1.ApiEdgeError(404, "Missing Related Entry"));
                parse(_this.relation.relationId).assign(scope.body, scope.response.data[_this.relation.from.idField || Api_1.Api.defaultIdField]);
                resolve(scope);
            });
        };
        this.inspect = function () { return ("RELATE CHANGE " + _this.relation.relationId); };
        this.relation = relation;
    }
    return RelateChangeQueryStep;
}());
exports.RelateChangeQueryStep = RelateChangeQueryStep;
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
exports.SetResponseQueryStep = SetResponseQueryStep;
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
exports.SetBodyQueryStep = SetBodyQueryStep;
var ProvideIdQueryStep = (function () {
    function ProvideIdQueryStep(fieldName) {
        var _this = this;
        if (fieldName === void 0) { fieldName = Api_1.Api.defaultIdField; }
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
exports.ProvideIdQueryStep = ProvideIdQueryStep;
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
                _this.context.populatedRelations.forEach(function (f) { return scope.context.populatedRelations.push(f); });
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
exports.ExtendContextQueryStep = ExtendContextQueryStep;
var ExtendContextLiveQueryStep = (function () {
    function ExtendContextLiveQueryStep(func) {
        var _this = this;
        this.execute = function (scope) {
            return new Promise(function (resolve) {
                _this.apply(scope.context);
                resolve(scope);
            });
        };
        this.inspect = function () {
            return "EXTEND CONTEXT LIVE";
        };
        this.apply = func;
    }
    return ExtendContextLiveQueryStep;
}());
exports.ExtendContextLiveQueryStep = ExtendContextLiveQueryStep;
var ApiQueryBuilder = (function () {
    function ApiQueryBuilder(api) {
        var _this = this;
        this.buildReadQuery = function (request) {
            var query = new ApiQuery_1.ApiQuery();
            var segments = request.path.segments, lastSegment = segments[segments.length - 1];
            _this.buildEmbedSteps(query, request, lastSegment);
            var baseQuery;
            if (lastSegment instanceof ApiRequest_1.EdgePathSegment) {
                baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.List);
                _this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
            }
            else if (lastSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
                baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.relation.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Get);
                _this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), lastSegment.relation, true);
            }
            else if (lastSegment instanceof ApiRequest_1.MethodPathSegment) {
                ApiQueryBuilder.addMethodCallStep(request, query, lastSegment.method);
                query.unshift(new ProvideIdQueryStep(lastSegment.edge.idField));
            }
            else {
                baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Get);
                _this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
            }
            query.unshift(new ExtendContextQueryStep(request.context));
            if (lastSegment instanceof ApiRequest_1.EntryPathSegment) {
                var _segment_1 = lastSegment;
                query.unshift(new ExtendContextLiveQueryStep(function (context) { return context.id = _segment_1.id; }));
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
            _this.api.actions
                .filter(function (action) { return action.triggerKind == ApiAction_1.ApiActionTriggerKind.OnInput; })
                .forEach(function (action) { return query.unshift(action); });
            return query;
        };
        this.buildChangeQuery = function (request) {
            var query = new ApiQuery_1.ApiQuery();
            var segments = request.path.segments, lastSegment = segments[segments.length - 1], readMode = true;
            _this.buildEmbedSteps(query, request, lastSegment);
            var baseQuery;
            if (lastSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
                if (request.type === ApiRequest_1.ApiRequestType.Update) {
                    baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Patch);
                    request.body = (_a = {}, _a[lastSegment.relation.relationId] = request.body.id || request.body._id, _a);
                    _this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
                }
                else if (request.type === ApiRequest_1.ApiRequestType.Patch) {
                    baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.relation.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Patch);
                    _this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
                }
                else {
                    throw new ApiEdgeError_1.ApiEdgeError(400, "Invalid Delete Query");
                }
            }
            else if (lastSegment instanceof ApiRequest_1.MethodPathSegment) {
                ApiQueryBuilder.addMethodCallStep(request, query, lastSegment.method);
                query.unshift(new ProvideIdQueryStep(lastSegment.edge.idField));
                readMode = false;
            }
            else {
                if (request.type === ApiRequest_1.ApiRequestType.Update) {
                    baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Update);
                    _this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
                }
                else if (request.type === ApiRequest_1.ApiRequestType.Patch) {
                    baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Patch);
                    _this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
                }
                else {
                    baseQuery = new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Delete);
                    _this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
                }
            }
            query.unshift(new ExtendContextQueryStep(request.context));
            if (lastSegment instanceof ApiRequest_1.EntryPathSegment) {
                var _segment_2 = lastSegment;
                query.unshift(new ExtendContextLiveQueryStep(function (context) { return context.id = _segment_2.id; }));
            }
            else if (lastSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
                if (request.type === ApiRequest_1.ApiRequestType.Update) {
                    var previousSegment = segments[segments.length - 2];
                    query.unshift(new ProvideIdQueryStep(previousSegment.edge.idField || Api_1.Api.defaultIdField));
                    readMode = false;
                }
                else {
                    query.unshift(new ProvideIdQueryStep(lastSegment.relation.relationId));
                }
            }
            else {
            }
            for (var i = segments.length - 2; i >= 0; i--) {
                var currentSegment = segments[i];
                var relation = segments[i + 1].relation;
                if (relation && !(relation instanceof OneToOneRelation_1.OneToOneRelation)) {
                    query.unshift(new RelateQueryStep(relation));
                    if (request.type !== ApiRequest_1.ApiRequestType.Delete) {
                        query.unshift(new RelateChangeQueryStep(relation));
                    }
                }
                if (readMode) {
                    readMode = _this.buildReadStep(query, currentSegment);
                }
                else {
                    readMode = _this.buildCheckStep(query, currentSegment);
                }
            }
            if (request.body)
                query.unshift(new SetBodyQueryStep(request.body));
            _this.api.actions
                .filter(function (action) { return action.triggerKind == ApiAction_1.ApiActionTriggerKind.OnInput; })
                .forEach(function (action) { return query.unshift(action); });
            return query;
            var _a;
        };
        this.buildCreateQuery = function (request) {
            var query = new ApiQuery_1.ApiQuery();
            var segments = request.path.segments, lastSegment = segments[segments.length - 1];
            _this.buildEmbedSteps(query, request, lastSegment);
            _this.addQueryStep(query, new QueryEdgeQueryStep(new ApiEdgeQuery_1.ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Create)));
            for (var i = segments.length - 2; i >= 0; i--) {
                var currentSegment = segments[i];
                var relation = segments[i + 1].relation;
                if (relation && !(relation instanceof OneToOneRelation_1.OneToOneRelation)) {
                    query.unshift(new RelateChangeQueryStep(relation));
                }
                _this.buildReadStep(query, currentSegment);
            }
            query.unshift(new SetBodyQueryStep(request.body));
            _this.api.actions
                .filter(function (action) { return action.triggerKind == ApiAction_1.ApiActionTriggerKind.OnInput; })
                .forEach(function (action) { return query.unshift(action); });
            return query;
        };
        this.build = function (request) {
            switch (request.type) {
                case ApiRequest_1.ApiRequestType.Read:
                    return _this.buildReadQuery(request);
                case ApiRequest_1.ApiRequestType.Update:
                case ApiRequest_1.ApiRequestType.Patch:
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
    ApiQueryBuilder.prototype.addQueryActions = function (triggerKind, query, edgeQuery, relation, output) {
        if (output === void 0) { output = false; }
        var edge = edgeQuery.edge, queryType = edgeQuery.type, trigger = relation ?
            ApiEdgeAction_1.ApiEdgeActionTrigger.Relation :
            (output ? ApiEdgeAction_1.ApiEdgeActionTrigger.OutputQuery : ApiEdgeAction_1.ApiEdgeActionTrigger.SubQuery);
        var actions;
        if (relation) {
            actions = edge.actions.filter(function (action) {
                return action.triggerKind == triggerKind &&
                    (action.targetTypes & queryType) &&
                    (action.triggers & trigger) &&
                    (!action.triggerNames.length || action.triggerNames.indexOf(relation.name) == -1);
            });
        }
        else {
            actions = edge.actions.filter(function (action) {
                return action.triggerKind == triggerKind &&
                    (action.targetTypes & queryType) &&
                    (action.triggers & trigger);
            });
        }
        actions.forEach(function (action) { return query.unshift(action); });
        if (output) {
            var apiTrigger_1 = triggerKind == ApiEdgeAction_1.ApiEdgeActionTriggerKind.BeforeEvent ?
                ApiAction_1.ApiActionTriggerKind.BeforeOutput : ApiAction_1.ApiActionTriggerKind.AfterOutput;
            this.api.actions
                .filter(function (action) { return action.triggerKind == apiTrigger_1; })
                .forEach(function (action) { return query.unshift(action); });
        }
    };
    ApiQueryBuilder.addMethodCallStep = function (request, query, method) {
        if (method.acceptedTypes & request.type) {
            query.unshift(new CallMethodQueryStep(method));
        }
        else {
            throw new ApiEdgeError_1.ApiEdgeError(405, "Method Not Allowed");
        }
    };
    ApiQueryBuilder.prototype.addQueryStep = function (query, step, relation, output) {
        if (relation === void 0) { relation = null; }
        if (output === void 0) { output = false; }
        this.addQueryActions(ApiEdgeAction_1.ApiEdgeActionTriggerKind.AfterEvent, query, step.query, relation, output);
        query.unshift(step);
        this.addQueryActions(ApiEdgeAction_1.ApiEdgeActionTriggerKind.BeforeEvent, query, step.query, relation, output);
    };
    ApiQueryBuilder.buildProvideIdStep = function (query, currentSegment) {
        if (currentSegment instanceof ApiRequest_1.EntryPathSegment) {
            query.unshift(new ExtendContextLiveQueryStep(function (context) { return context.id = currentSegment.id; }));
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
            query.unshift(new SetResponseQueryStep(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse((_a = {}, _a[currentSegment.edge.idField || Api_1.Api.defaultIdField] = currentSegment.id, _a))));
            return false;
        }
        else if (currentSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
            this.addQueryStep(query, new QueryEdgeQueryStep(new ApiEdgeQuery_1.ApiEdgeQuery(currentSegment.relation.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Get)), currentSegment.relation);
        }
        else {
            throw new ApiEdgeError_1.ApiEdgeError(500, "Not Implemented");
        }
        return ApiQueryBuilder.buildProvideIdStep(query, currentSegment);
        var _a;
    };
    ApiQueryBuilder.prototype.buildReadStep = function (query, currentSegment) {
        if (currentSegment instanceof ApiRequest_1.RelatedFieldPathSegment) {
            this.addQueryStep(query, new QueryEdgeQueryStep(new ApiEdgeQuery_1.ApiEdgeQuery(currentSegment.relation.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Get)), currentSegment.relation);
        }
        else {
            this.addQueryStep(query, new QueryEdgeQueryStep(new ApiEdgeQuery_1.ApiEdgeQuery(currentSegment.edge, ApiEdgeQueryType_1.ApiEdgeQueryType.Get)));
        }
        return ApiQueryBuilder.buildProvideIdStep(query, currentSegment);
    };
    ApiQueryBuilder.prototype.buildEmbedSteps = function (query, request, lastSegment) {
        if (request.type === ApiRequest_1.ApiRequestType.Read && lastSegment instanceof ApiRequest_1.EdgePathSegment) {
            for (var _i = 0, _a = request.context.populatedRelations; _i < _a.length; _i++) {
                var relation = _a[_i];
                var segment = new ApiRequest_1.EdgePathSegment(relation.to, relation);
                var embedRequest = new ApiRequest_1.ApiRequest(request.api);
                embedRequest.path.add(segment);
                query.unshift(new EmbedQueryQueryStep(this.build(embedRequest), segment, embedRequest));
            }
        }
        else {
            for (var _b = 0, _c = request.context.populatedRelations; _b < _c.length; _b++) {
                var relation = _c[_b];
                var segment = new ApiRequest_1.EntryPathSegment(relation.to, 'TBD', relation);
                var embedRequest = new ApiRequest_1.ApiRequest(request.api);
                embedRequest.path.add(segment);
                query.unshift(new EmbedQueryQueryStep(this.build(embedRequest), segment, embedRequest));
            }
        }
    };
    return ApiQueryBuilder;
}());
exports.ApiQueryBuilder = ApiQueryBuilder;
//# sourceMappingURL=ApiQueryBuilder.js.map