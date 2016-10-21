"use strict";
var OneToManyRelation = (function () {
    function OneToManyRelation(name, from, to, relationId) {
        if (relationId === void 0) { relationId = null; }
        this.query = function (relatedId, queryItems) {
            throw "Not Implemented";
        };
        this.name = name;
        this.from = from;
        this.to = to;
        this.relationId = relationId || this.to.name + "Id";
    }
    return OneToManyRelation;
}());
exports.OneToManyRelation = OneToManyRelation;
