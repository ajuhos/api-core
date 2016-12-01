"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ModelEdge_1 = require("../edges/ModelEdge");
var Course = (function (_super) {
    __extends(Course, _super);
    function Course(obj) {
        _super.call(this, obj);
        this.name = obj.name;
        this.courseTypeId = obj.courseTypeId;
        this.classId = obj.classId;
    }
    Course.create = function (id, name, courseTypeId, classId) {
        return new Course({ id: id, name: name, courseTypeId: courseTypeId, classId: classId });
    };
    return Course;
}(ModelEdge_1.Model));
exports.Course = Course;
//# sourceMappingURL=Course.js.map