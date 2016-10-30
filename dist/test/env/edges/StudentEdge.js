"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RawDataProvider_1 = require("../data/RawDataProvider");
var Student_1 = require("../model/Student");
var ModelEdge_1 = require("./ModelEdge");
var ApiEdgeError_1 = require("../../../src/query/ApiEdgeError");
var StudentEdge = (function (_super) {
    __extends(StudentEdge, _super);
    function StudentEdge() {
        _super.call(this);
        this.name = "student";
        this.pluralName = "students";
        this.provider = RawDataProvider_1.RawDataProvider.students;
        this.createModel = function (obj) { return new Student_1.Student(obj); };
        this.entryMethod("rename", function (scope) {
            return new Promise(function (resolve, reject) {
                if (!scope.response)
                    return reject(new ApiEdgeError_1.ApiEdgeError(404, "Not Found"));
                var entry = scope.response.data;
                if (!scope.body || !scope.body.name)
                    return reject(new ApiEdgeError_1.ApiEdgeError(422, "No Name Provided"));
                var nameParts = scope.body.name.split(' ');
                if (nameParts.length != 2 ||
                    !nameParts[0].length ||
                    !nameParts[1].length)
                    return reject(new ApiEdgeError_1.ApiEdgeError(422, "Invalid Name Provided"));
                entry.firstName = nameParts[0];
                entry.lastName = nameParts[1];
                resolve(scope);
            });
        });
    }
    return StudentEdge;
}(ModelEdge_1.ModelEdge));
exports.StudentEdge = StudentEdge;
//# sourceMappingURL=StudentEdge.js.map