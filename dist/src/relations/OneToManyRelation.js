"use strict";
var Api_1 = require("../Api");
var OneToManyRelation = (function () {
    function OneToManyRelation(from, to, options) {
        if (options === void 0) { options = { relationId: null, relatedId: null, name: null }; }
        this.from = from;
        this.to = to;
        this.name = options.name || to.pluralName;
        this.relatedId = options.relatedId || to.idField;
        this.relationId = options.relationId || from.name + Api_1.Api.defaultIdPostfix;
    }
    return OneToManyRelation;
}());
exports.OneToManyRelation = OneToManyRelation;
//# sourceMappingURL=OneToManyRelation.js.map