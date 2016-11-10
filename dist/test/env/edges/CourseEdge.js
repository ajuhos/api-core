"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RawDataProvider_1 = require("../data/RawDataProvider");
var ModelEdge_1 = require("./ModelEdge");
var Course_1 = require("../model/Course");
var ApiEdgeSchema_1 = require("../../../src/edge/ApiEdgeSchema");
var CourseEdge = (function (_super) {
    __extends(CourseEdge, _super);
    function CourseEdge() {
        _super.apply(this, arguments);
        this.name = "course";
        this.pluralName = "courses";
        this.schema = new ApiEdgeSchema_1.ApiEdgeSchema({
            id: "=",
            name: "=",
            classId: "=",
            courseTypeId: "="
        });
        this.provider = RawDataProvider_1.RawDataProvider.courses;
        this.createModel = function (obj) { return new Course_1.Course(obj); };
    }
    return CourseEdge;
}(ModelEdge_1.ModelEdge));
exports.CourseEdge = CourseEdge;
//# sourceMappingURL=CourseEdge.js.map