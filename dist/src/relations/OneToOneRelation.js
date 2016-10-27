"use strict";
var OneToOneRelation = (function () {
    function OneToOneRelation(from, to, options) {
        if (options === void 0) { options = { relationId: null, relatedId: null, name: null }; }
        this.from = from;
        this.to = to;
        this.name = options.name || to.name;
        this.relationId = options.relationId || to.name + "Id";
        this.relatedId = options.relatedId || from.name + "Id";
    }
    return OneToOneRelation;
}());
exports.OneToOneRelation = OneToOneRelation;
//# sourceMappingURL=OneToOneRelation.js.map