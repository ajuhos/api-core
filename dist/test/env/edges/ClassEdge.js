"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RawDataProvider_1 = require("../data/RawDataProvider");
var ModelEdge_1 = require("./ModelEdge");
var Class_1 = require("../model/Class");
var ApiEdgeSchema_1 = require("../../../src/edge/ApiEdgeSchema");
var ClassEdge = (function (_super) {
    __extends(ClassEdge, _super);
    function ClassEdge() {
        _super.apply(this, arguments);
        this.name = "class";
        this.pluralName = "classes";
        this.schema = new ApiEdgeSchema_1.ApiEdgeSchema({
            id: "=",
            name: "=",
            year: "=semester",
            room: "=",
            schoolId: "="
        });
        this.provider = RawDataProvider_1.RawDataProvider.classes;
        this.createModel = function (obj) { return new Class_1.Class(obj); };
    }
    return ClassEdge;
}(ModelEdge_1.ModelEdge));
exports.ClassEdge = ClassEdge;
//# sourceMappingURL=ClassEdge.js.map