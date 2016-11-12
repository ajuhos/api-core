"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RawDataProvider_1 = require("../data/RawDataProvider");
var ModelEdge_1 = require("./ModelEdge");
var School_1 = require("../model/School");
var ApiEdgeSchema_1 = require("../../../src/edge/ApiEdgeSchema");
var SchoolEdge = (function (_super) {
    __extends(SchoolEdge, _super);
    function SchoolEdge() {
        _super.apply(this, arguments);
        this.name = "school";
        this.pluralName = "schools";
        this.schema = new ApiEdgeSchema_1.ApiEdgeSchema({
            id: "=",
            name: "=",
            address: "=",
            phone: "="
        });
        this.provider = RawDataProvider_1.RawDataProvider.schools;
        this.createModel = function (obj) { return new School_1.School(obj); };
    }
    return SchoolEdge;
}(ModelEdge_1.ModelEdge));
exports.SchoolEdge = SchoolEdge;
//# sourceMappingURL=SchoolEdge.js.map