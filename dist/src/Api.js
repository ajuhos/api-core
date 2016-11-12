"use strict";
var ApiRequestParser_1 = require("./request/ApiRequestParser");
var ApiQueryBuilder_1 = require("./query/ApiQueryBuilder");
var ApiAction_1 = require("./query/ApiAction");
var Api = (function () {
    function Api(version) {
        var _this = this;
        var edges = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            edges[_i - 1] = arguments[_i];
        }
        this.edges = [];
        this.actions = [];
        this.parseRequest = function (requestParts) {
            return _this.parser.parse(requestParts);
        };
        this.buildQuery = function (request) {
            return _this.queryBuilder.build(request);
        };
        this.use = function (action) {
            _this.actions.unshift(action);
            return _this;
        };
        this.action = function (name, execute, triggerKind) {
            if (triggerKind === void 0) { triggerKind = ApiAction_1.ApiActionTriggerKind.OnInput; }
            _this.actions.unshift(new ApiAction_1.ApiAction(name, execute, triggerKind));
            return _this;
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
    Api.defaultIdPostfix = "Id";
    Api.defaultIdField = "id";
    return Api;
}());
exports.Api = Api;
//# sourceMappingURL=Api.js.map