"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ModelEdge_1 = require("../edges/ModelEdge");
var StudentCourseConnection = (function (_super) {
    __extends(StudentCourseConnection, _super);
    function StudentCourseConnection(obj) {
        _super.call(this, obj);
        this.courseId = obj.courseId;
        this.studentId = obj.studentId;
    }
    StudentCourseConnection.create = function (id, courseId, studentId) {
        return new StudentCourseConnection({ id: id, courseId: courseId, studentId: studentId });
    };
    return StudentCourseConnection;
}(ModelEdge_1.Model));
exports.StudentCourseConnection = StudentCourseConnection;
//# sourceMappingURL=StudentCourseConnection.js.map