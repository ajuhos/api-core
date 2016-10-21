"use strict";
var ApiEdgeQuery_1 = require("../ApiEdgeQuery");
var ApiEdgeQueryType_1 = require("../ApiEdgeQueryType");
var OneToOneRelation = (function () {
    function OneToOneRelation(name, from, to, relationId) {
        var _this = this;
        if (relationId === void 0) { relationId = null; }
        this.createExistsQuery = function (relatedId) {
            return new ApiEdgeQuery_1.ApiEdgeQuery(_this.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Exists, { where: { id: relatedId } });
        };
        this.createGetQuery = function (relatedId) {
            return new ApiEdgeQuery_1.ApiEdgeQuery(_this.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Get, { where: { id: relatedId } });
        };
        this.query = function (relatedId, queryItems) {
            if (queryItems[0] === _this.name)
                queryItems.shift();
            else
                return null;
            if (queryItems.length) {
                return _this.createExistsQuery(relatedId);
            }
            else {
                return _this.createGetQuery(relatedId);
            }
        };
        this.name = name;
        this.from = from;
        this.to = to;
        this.relationId = relationId || this.to.name + "Id";
    }
    return OneToOneRelation;
}());
exports.OneToOneRelation = OneToOneRelation;
