"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ModelEdge_1 = require("../edges/ModelEdge");
var Class = (function (_super) {
    __extends(Class, _super);
    function Class(obj) {
        _super.call(this, obj);
        this.name = obj.name;
        this.semester = obj.semester;
        this.room = obj.room;
        this.schoolId = obj.schoolId;
    }
    Class.create = function (id, name, semester, room, schoolId) {
        return new Class({ id: id, name: name, semester: semester, room: room, schoolId: schoolId });
    };
    return Class;
}(ModelEdge_1.Model));
exports.Class = Class;
//# sourceMappingURL=Class.js.map