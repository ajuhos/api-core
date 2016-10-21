"use strict";
var ApiEdgeQuery_1 = require("../ApiEdgeQuery");
var ApiEdgeQueryType_1 = require("../ApiEdgeQueryType");
var OneToOneRelation = (function () {
    function OneToOneRelation(from, to, options) {
        var _this = this;
        if (options === void 0) { options = { relationId: null, name: null }; }
        this.createExistsQuery = function (relatedId) {
            return new ApiEdgeQuery_1.ApiEdgeQuery(_this.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Exists, { id: relatedId });
        };
        this.createGetQuery = function (relatedId) {
            return new ApiEdgeQuery_1.ApiEdgeQuery(_this.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Get, { id: relatedId });
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
        this.from = from;
        this.to = to;
        this.name = options.name || to.name;
        this.relationId = options.relationId || to.name + "Id";
    }
    return OneToOneRelation;
}());
exports.OneToOneRelation = OneToOneRelation;
