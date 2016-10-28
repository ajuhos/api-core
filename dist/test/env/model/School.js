"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ModelEdge_1 = require("../edges/ModelEdge");
var School = (function (_super) {
    __extends(School, _super);
    function School(obj) {
        _super.call(this, obj);
        this.name = obj.name;
        this.address = obj.address;
        this.phone = obj.phone;
    }
    School.create = function (id, name, address, phone) {
        return new School({ id: id, name: name, address: address, phone: phone });
    };
    return School;
}(ModelEdge_1.Model));
exports.School = School;
//# sourceMappingURL=School.js.map