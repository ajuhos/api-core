"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RawDataProvider_1 = require("../data/RawDataProvider");
var Student_1 = require("../model/Student");
var ModelEdge_1 = require("./ModelEdge");
var StudentEdge = (function (_super) {
    __extends(StudentEdge, _super);
    function StudentEdge() {
        _super.apply(this, arguments);
        this.name = "student";
        this.pluralName = "students";
        this.provider = RawDataProvider_1.RawDataProvider.students;
        this.createModel = function (obj) { return new Student_1.Student(obj); };
    }
    return StudentEdge;
}(ModelEdge_1.ModelEdge));
exports.StudentEdge = StudentEdge;
//# sourceMappingURL=StudentEdge.js.map