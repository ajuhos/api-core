"use strict";
var ApiRequestParser_1 = require("./request/ApiRequestParser");
var ApiQueryBuilder_1 = require("./query/ApiQueryBuilder");
var Api = (function () {
    function Api(version) {
        var _this = this;
        var edges = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            edges[_i - 1] = arguments[_i];
        }
        this.edges = [];
        this.parseRequest = function (requestParts) {
            return _this.parser.parse(requestParts);
        };
        this.buildQuery = function (request) {
            return _this.queryBuilder.build(request);
        };
        this.version = version;
        this.edges = edges;
        this.parser = new ApiRequestParser_1.ApiRequestParser(this);
        this.queryBuilder = new ApiQueryBuilder_1.ApiQueryBuilder(this);
    }
    Api.prototype.edge = function (edge) {
        this.edges.push(edge);
        return this;
    };
    ;
    Api.prototype.relation = function (relation) {
        relation.from.relations.push(relation);
        relation.to.relations.push(relation);
        return this;
    };
    return Api;
}());
exports.Api = Api;
//# sourceMappingURL=Api.js.map