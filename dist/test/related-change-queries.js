"use strict";
var tap = require('tap');
var Api_1 = require("../src/Api");
var builder = require("../src/query/ApiQueryBuilder");
var OneToOneRelation_1 = require("../src/relations/OneToOneRelation");
var OneToManyRelation_1 = require("../src/relations/OneToManyRelation");
var StudentEdge_1 = require("./env/edges/StudentEdge");
var ClassEdge_1 = require("./env/edges/ClassEdge");
var CourseEdge_1 = require("./env/edges/CourseEdge");
var CourseTypeEdge_1 = require("./env/edges/CourseTypeEdge");
var SchoolEdge_1 = require("./env/edges/SchoolEdge");
var ApiRequest_1 = require("../src/request/ApiRequest");
var studentEdge = new StudentEdge_1.StudentEdge, classEdge = new ClassEdge_1.ClassEdge, courseEdge = new CourseEdge_1.CourseEdge, courseTypeEdge = new CourseTypeEdge_1.CourseTypeEdge, schoolEdge = new SchoolEdge_1.SchoolEdge;
var api;
tap.test('creating the API should work', function (t) {
    api = new Api_1.Api('1.0')
        .edge(studentEdge)
        .edge(classEdge)
        .edge(courseEdge)
        .edge(courseTypeEdge)
        .edge(schoolEdge)
        .relation(new OneToOneRelation_1.OneToOneRelation(courseEdge, courseTypeEdge))
        .relation(new OneToManyRelation_1.OneToManyRelation(courseTypeEdge, courseEdge))
        .relation(new OneToManyRelation_1.OneToManyRelation(studentEdge, courseEdge))
        .relation(new OneToOneRelation_1.OneToOneRelation(studentEdge, classEdge))
        .relation(new OneToOneRelation_1.OneToOneRelation(classEdge, schoolEdge))
        .relation(new OneToOneRelation_1.OneToOneRelation(courseEdge, classEdge))
        .relation(new OneToManyRelation_1.OneToManyRelation(classEdge, studentEdge))
        .relation(new OneToManyRelation_1.OneToManyRelation(classEdge, courseEdge))
        .relation(new OneToManyRelation_1.OneToManyRelation(schoolEdge, studentEdge))
        .relation(new OneToManyRelation_1.OneToManyRelation(schoolEdge, classEdge));
    t.end();
});
tap.test('POST /schools/s2/students', function (t) {
    var request = api.parseRequest(['schools', 's2', 'students']);
    request.type = ApiRequest_1.ApiRequestType.Create;
    request.body = {
        id: "s7",
        fullName: "Marry Test",
        email: "marry.test@gmail.com",
        classId: "c1"
    };
    var query = api.buildQuery(request);
    t.equal(query.steps.length, 5, 'should build a 5 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[3] instanceof builder.RelateChangeQueryStep, 'RELATE CHANGE schoolId');
    t.ok(query.steps[4] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');
    query.execute()
        .then(function (resp) {
        t.same(resp.data, {
            id: "s7",
            fullName: "Marry Test",
            email: "marry.test@gmail.com",
            schoolId: "s2",
            classId: "c1"
        });
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function () {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
tap.test('POST /schools/s2/classes/c1/students', function (t) {
    var request = api.parseRequest(['schools', 's2', 'classes', 'c1', 'students']);
    request.type = ApiRequest_1.ApiRequestType.Create;
    request.body = {
        id: "s8",
        fullName: "Adam Test",
        email: "adam.test@gmail.com"
    };
    var query = api.buildQuery(request);
    t.equal(query.steps.length, 8, 'should build a 8 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[3] instanceof builder.RelateChangeQueryStep, 'RELATE CHANGE schoolId');
    t.ok(query.steps[4] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[5] instanceof builder.QueryEdgeQueryStep, 'QUERY /classes');
    t.ok(query.steps[6] instanceof builder.RelateChangeQueryStep, 'RELATE CHANGE classId');
    t.ok(query.steps[7] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');
    query.execute()
        .then(function (resp) {
        t.same(resp.data, {
            id: "s8",
            fullName: "Adam Test",
            email: "adam.test@gmail.com",
            schoolId: "s2",
            classId: "c1"
        });
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function () {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
//# sourceMappingURL=related-change-queries.js.map