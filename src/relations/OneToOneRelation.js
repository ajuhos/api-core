"use strict";
const ApiEdgeQuery_1 = require("../ApiEdgeQuery");
const ApiEdgeQueryType_1 = require("../ApiEdgeQueryType");
class OneToOneRelation {
    constructor(name, from, to, relationId = null) {
        this.createExistsQuery = (relatedId) => {
            return new ApiEdgeQuery_1.ApiEdgeQuery(this.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Exists, { where: { id: relatedId } });
        };
        this.createGetQuery = (relatedId) => {
            return new ApiEdgeQuery_1.ApiEdgeQuery(this.to, ApiEdgeQueryType_1.ApiEdgeQueryType.Get, { where: { id: relatedId } });
        };
        this.query = (relatedId, queryItems) => {
            if (queryItems[0] === this.name)
                queryItems.shift();
            else
                return null;
            if (queryItems.length) {
                return this.createExistsQuery(relatedId);
            }
            else {
                return this.createGetQuery(relatedId);
            }
        };
        this.name = name;
        this.from = from;
        this.to = to;
        this.relationId = relationId || this.to.name + "Id";
    }
}
exports.OneToOneRelation = OneToOneRelation;
//# sourceMappingURL=OneToOneRelation.js.map