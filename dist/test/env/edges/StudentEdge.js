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
var ApiRequest_1 = require("../../../src/request/ApiRequest");
var ApiEdgeQueryResponse_1 = require("../../../src/edge/ApiEdgeQueryResponse");
var ApiEdgeSchema_1 = require("../../../src/edge/ApiEdgeSchema");
var ApiEdgeQuery_1 = require("../../../src/edge/ApiEdgeQuery");
var ApiEdgeQueryType_1 = require("../../../src/edge/ApiEdgeQueryType");
var StudentEdge = (function (_super) {
    __extends(StudentEdge, _super);
    function StudentEdge() {
        var _this = this;
        _super.call(this);
        this.name = "student";
        this.pluralName = "students";
        this.schema = new ApiEdgeSchema_1.ApiEdgeSchema({
            id: "=",
            fullName: new ApiEdgeSchema_1.ApiEdgeSchemaTransformation(function (schema, model) {
                var parts = schema.fullName.split(' ');
                if (parts.length != 2)
                    throw new ApiEdgeError_1.ApiEdgeError(400, "Invalid full name");
                model.firstName = parts[0];
                model.lastName = parts[1];
            }, function (model, schema) {
                schema.fullName = [model.firstName, model.lastName].join(' ');
            }, ["firstName", "lastName"]),
            email: "=",
            schoolId: "=",
            classId: "="
        });
        this.provider = RawDataProvider_1.RawDataProvider.students;
        this.createModel = function (obj) { return new Student_1.Student(obj); };
        this.entryMethod("rename", function (scope) {
            return new Promise(function (resolve, reject) {
                return (new ApiEdgeQuery_1.ApiEdgeQuery(_this, ApiEdgeQueryType_1.ApiEdgeQueryType.Patch, scope.context, {
                    fullName: scope.body.name.split(' ').reverse().join(' ')
                })).execute().then(resolve, reject);
            });
        }, ApiRequest_1.ApiRequestType.Change);
        this.entryMethod("withHungarianName", function (scope) {
            return new Promise(function (resolve) {
                var student = JSON.parse(JSON.stringify((scope.response || {}).data));
                student.hungarianName = student.fullName.split(' ').reverse().join(' ');
                resolve(new ApiEdgeQueryResponse_1.ApiEdgeQueryResponse(student));
            });
        }, ApiRequest_1.ApiRequestType.Read);
    }
    return StudentEdge;
}(ModelEdge_1.ModelEdge));
exports.StudentEdge = StudentEdge;
//# sourceMappingURL=StudentEdge.js.map