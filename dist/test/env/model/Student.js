"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ModelEdge_1 = require("../edges/ModelEdge");
var Student = (function (_super) {
    __extends(Student, _super);
    function Student(obj) {
        _super.call(this, obj);
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.email = obj.email;
        this.phone = obj.phone;
        this.schoolId = obj.schoolId;
        this.classId = obj.classId;
    }
    Student.create = function (id, firstName, lastName, email, phone, schoolId, classId) {
        return new Student({ id: id, firstName: firstName, lastName: lastName, email: email, phone: phone, schoolId: schoolId, classId: classId });
    };
    return Student;
}(ModelEdge_1.Model));
exports.Student = Student;
//# sourceMappingURL=Student.js.map