"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ModelEdge_1 = require("../edges/ModelEdge");
var CourseTypeScheme = (function () {
    function CourseTypeScheme() {
    }
    return CourseTypeScheme;
}());
exports.CourseTypeScheme = CourseTypeScheme;
var CourseType = (function (_super) {
    __extends(CourseType, _super);
    function CourseType(obj) {
        _super.call(this, obj);
        this.name = obj.name;
    }
    CourseType.create = function (id, name) {
        return new CourseType({ id: id, name: name });
    };
    return CourseType;
}(ModelEdge_1.Model));
exports.CourseType = CourseType;
//# sourceMappingURL=CourseType.js.map