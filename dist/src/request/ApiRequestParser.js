"use strict";
var ApiRequest_1 = require("./ApiRequest");
var OneToOneRelation_1 = require("../relations/OneToOneRelation");
var OneToManyRelation_1 = require("../relations/OneToManyRelation");
var ApiEdgeError_1 = require("../query/ApiEdgeError");
var ApiRequestPathParser = (function () {
    function ApiRequestPathParser(api) {
        this.api = api;
    }
    ApiRequestPathParser.prototype.findEdgeByName = function (name) {
        return this.api.edges.find(function (edge) { return edge.pluralName === name; });
    };
    ApiRequestPathParser.prototype.findRelationByName = function (edge, name) {
        return edge.relations.find(function (rel) { return rel.name === name; });
    };
    ApiRequestPathParser.prototype.parse = function (segments) {
        var requestPath = new ApiRequest_1.ApiRequestPath();
        var lastEdge = null, lastRelation = null, wasEntry = false;
        while (segments.length) {
            var segment = segments.shift();
            if (lastEdge) {
                var relation = this.findRelationByName(lastEdge, segment);
                if (relation) {
                    if (relation instanceof OneToOneRelation_1.OneToOneRelation) {
                        requestPath.add(new ApiRequest_1.RelatedFieldPathSegment(lastEdge, relation));
                        lastEdge = relation.to;
                        lastRelation = relation;
                        wasEntry = true;
                    }
                    else if (wasEntry && relation instanceof OneToManyRelation_1.OneToManyRelation) {
                        lastEdge = relation.to;
                        lastRelation = relation;
                        wasEntry = false;
                    }
                    else {
                        throw new ApiEdgeError_1.ApiEdgeError(400, "Unsupported Relation: " + segment);
                    }
                }
                else if (!wasEntry) {
                    requestPath.add(new ApiRequest_1.EntryPathSegment(lastEdge, "" + segment, lastRelation));
                    wasEntry = true;
                }
                else {
                    throw new ApiEdgeError_1.ApiEdgeError(400, "Missing Relation: " + lastEdge.name + " -> " + segment);
                }
            }
            else {
                var edge = this.findEdgeByName(segment);
                if (edge) {
                    lastEdge = edge;
                    wasEntry = false;
                }
                else {
                    throw new ApiEdgeError_1.ApiEdgeError(400, "Missing Edge: " + segment);
                }
            }
        }
        if (lastEdge && !wasEntry) {
            requestPath.add(new ApiRequest_1.EdgePathSegment(lastEdge, lastRelation));
            lastEdge = null;
        }
        return requestPath;
    };
    return ApiRequestPathParser;
}());
exports.ApiRequestPathParser = ApiRequestPathParser;
var ApiRequestParser = (function () {
    function ApiRequestParser(api) {
        this.api = api;
        this.pathParser = new ApiRequestPathParser(api);
    }
    ApiRequestParser.prototype.parse = function (segments) {
        var request = new ApiRequest_1.ApiRequest();
        request.path = this.pathParser.parse(segments);
        return request;
    };
    return ApiRequestParser;
}());
exports.ApiRequestParser = ApiRequestParser;
//# sourceMappingURL=ApiRequestParser.js.map