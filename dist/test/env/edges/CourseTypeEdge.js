"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RawDataProvider_1 = require("../data/RawDataProvider");
var ModelEdge_1 = require("./ModelEdge");
var CourseType_1 = require("../model/CourseType");
var ApiEdgeSchema_1 = require("../../../src/edge/ApiEdgeSchema");
var CourseTypeEdge = (function (_super) {
    __extends(CourseTypeEdge, _super);
    function CourseTypeEdge() {
        _super.apply(this, arguments);
        this.name = "courseType";
        this.pluralName = "courseTypes";
        this.schema = new ApiEdgeSchema_1.ApiEdgeSchema({
            id: "=",
            name: "="
        });
        this.provider = RawDataProvider_1.RawDataProvider.courseTypes;
        this.createModel = function (obj) { return new CourseType_1.CourseType(obj); };
    }
    return CourseTypeEdge;
}(ModelEdge_1.ModelEdge));
exports.CourseTypeEdge = CourseTypeEdge;
//# sourceMappingURL=CourseTypeEdge.js.map