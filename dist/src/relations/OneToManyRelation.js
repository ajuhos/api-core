"use strict";
var OneToManyRelation = (function () {
    function OneToManyRelation(from, to, options) {
        if (options === void 0) { options = { relationId: null, relatedId: null, name: null }; }
        this.from = from;
        this.to = to;
        this.name = options.name || to.pluralName;
        this.relatedId = options.relatedId || to.name + "Id";
        this.relationId = options.relationId || from.name + "Id";
    }
    return OneToManyRelation;
}());
exports.OneToManyRelation = OneToManyRelation;
//# sourceMappingURL=OneToManyRelation.js.map