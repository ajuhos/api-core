"use strict";
var OneToManyRelation = (function () {
    function OneToManyRelation(from, to, options) {
        if (options === void 0) { options = { relationId: null, name: null }; }
        this.query = function (relatedId, queryItems) {
            throw "Not Implemented";
        };
        this.from = from;
        this.to = to;
        this.name = options.name || to.name;
        this.relationId = options.relationId || to.name + "Id";
    }
    return OneToManyRelation;
}());
exports.OneToManyRelation = OneToManyRelation;
