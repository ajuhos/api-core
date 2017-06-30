"use strict";
var Api_1 = require("../Api");
var OneToOneRelation = (function () {
    function OneToOneRelation(from, to, options) {
        if (options === void 0) { options = { relationId: null, relatedId: null, name: null }; }
        this.from = from;
        this.to = to;
        this.name = options.name || to.name;
        this.relatedId = options.relatedId || from.idField;
        this.relationId = options.relationId || to.name + Api_1.Api.defaultIdPostfix;
    }
    return OneToOneRelation;
}());
exports.OneToOneRelation = OneToOneRelation;
//# sourceMappingURL=OneToOneRelation.js.map