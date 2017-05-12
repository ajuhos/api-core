"use strict";
var ApiEdgeError_1 = require("../src/query/ApiEdgeError");
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
tap.test('Any type queries should fail', function (t) {
    try {
        var request = new ApiRequest_1.ApiRequest(api);
        request.type = ApiRequest_1.ApiRequestType.Any;
        api.buildQuery(request);
        t.ok(false, 'an invalid query should not succeed');
    }
    catch (e) {
        t.ok(e instanceof ApiEdgeError_1.ApiEdgeError);
        t.equal(e.message, 'Unsupported Query Type');
        t.equal(e.status, 400);
    }
    t.end();
});
tap.test('Change type queries should fail', function (t) {
    try {
        var request = new ApiRequest_1.ApiRequest(api);
        request.type = ApiRequest_1.ApiRequestType.Change;
        api.buildQuery(request);
        t.ok(false, 'an invalid query should not succeed');
    }
    catch (e) {
        t.ok(e instanceof ApiEdgeError_1.ApiEdgeError);
        t.equal(e.message, 'Unsupported Query Type');
        t.equal(e.status, 400);
    }
    t.end();
});
tap.test('/schools', function (t) {
    var request = api.parseRequest(['schools']), query = api.buildQuery(request);
    t.equal(query.steps.length, 2, 'should build a 2 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep);
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep);
    query.execute()
        .then(function (resp) {
        t.same(resp.data, [
            {
                address: "16, Test street, North Pole, HA23535",
                id: "s1",
                name: "First School",
                phone: "435234523"
            },
            {
                address: "12, Test street, North Pole, HA23535",
                id: "s2",
                name: "Second School",
                phone: "456345283"
            }
        ]);
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function (e) {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
tap.test('/schools/s2', function (t) {
    var request = api.parseRequest(['schools', 's2']), query = api.buildQuery(request);
    t.equal(query.steps.length, 3, 'should build a 3 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextLiveQueryStep);
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep);
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep);
    query.execute()
        .then(function (resp) {
        t.same(resp.data, {
            address: "12, Test street, North Pole, HA23535",
            id: "s2",
            name: "Second School",
            phone: "456345283"
        });
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function () {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
tap.test('/schools/s5', function (t) {
    var request = api.parseRequest(['schools', 's5']), query = api.buildQuery(request);
    query.execute()
        .then(function () {
        t.ok(false, "an invalid query should not succeed");
        t.end();
    })
        .catch(function (e) {
        t.ok(e instanceof ApiEdgeError_1.ApiEdgeError);
        t.equal(e.status, 404);
        t.equal(e.message, 'Not Found');
        t.end();
    });
});
tap.test('/schools/s1/classes', function (t) {
    var request = api.parseRequest(['schools', 's1', 'classes']), query = api.buildQuery(request);
    t.equal(query.steps.length, 5, 'should build a 5 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextLiveQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[2] instanceof builder.RelateQueryStep, 'RELATE schoolId');
    t.ok(query.steps[3] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[4] instanceof builder.QueryEdgeQueryStep, 'QUERY /classes');
    query.execute()
        .then(function (resp) {
        t.same(resp.data, [
            {
                id: "c1",
                name: "A",
                year: 1,
                room: "Room 1",
                schoolId: "s1"
            }
        ]);
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function () {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
tap.test('/schools/s1/classes/c1', function (t) {
    var request = api.parseRequest(['schools', 's1', 'classes', 'c1']), query = api.buildQuery(request);
    t.equal(query.steps.length, 6, 'should build a 6 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextLiveQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[2] instanceof builder.RelateQueryStep, 'RELATE schoolId');
    t.ok(query.steps[3] instanceof builder.ExtendContextLiveQueryStep, 'EXTEND');
    t.ok(query.steps[4] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[5] instanceof builder.QueryEdgeQueryStep, 'QUERY /classes');
    query.execute()
        .then(function (resp) {
        t.same(resp.data, {
            id: "c1",
            name: "A",
            year: 1,
            room: "Room 1",
            schoolId: "s1"
        });
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function () {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
tap.test('/students/s2/class', function (t) {
    var request = api.parseRequest(['students', 's2', 'class']), query = api.buildQuery(request);
    t.equal(query.steps.length, 5, 'should build a 5 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextLiveQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');
    t.ok(query.steps[2] instanceof builder.ProvideIdQueryStep, 'PROVIDE ID: classId');
    t.ok(query.steps[3] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[4] instanceof builder.QueryEdgeQueryStep, 'QUERY /classes');
    query.execute()
        .then(function (resp) {
        t.same(resp.data, {
            id: "c1",
            name: "A",
            year: 1,
            room: "Room 1",
            schoolId: "s1"
        });
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function () {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
tap.test('/schools/s1/classes/c2', function (t) {
    var request = api.parseRequest(['schools', 's1', 'classes', 'c2']), query = api.buildQuery(request);
    query.execute()
        .then(function () {
        t.ok(false, "an invalid query should not succeed");
        t.end();
    })
        .catch(function (e) {
        t.ok(e instanceof ApiEdgeError_1.ApiEdgeError);
        t.equal(e.status, 404);
        t.equal(e.message, 'Not Found');
        t.end();
    });
});
tap.test('POST /schools', function (t) {
    var request = api.parseRequest(['schools']);
    request.type = ApiRequest_1.ApiRequestType.Create;
    var body = request.body = {
        address: "12, Test street, North Pole, HA23535",
        id: "s3",
        name: "Third School",
        phone: "456345283"
    };
    var query = api.buildQuery(request);
    t.equal(query.steps.length, 2, 'should build a 2 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep);
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep);
    query.execute()
        .then(function (resp) {
        t.same(resp.data, body);
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function () {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
tap.test('DELETE /schools/s3', function (t) {
    var request = api.parseRequest(['schools', 's3']);
    request.type = ApiRequest_1.ApiRequestType.Delete;
    var query = api.buildQuery(request);
    t.equal(query.steps.length, 3, 'should build a 3 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextLiveQueryStep);
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep);
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep);
    query.execute()
        .then(function (resp) {
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function () {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
tap.test('DELETE /students/s2/class', function (t) {
    var request = api.parseRequest(['students', 's2', 'class']);
    request.type = ApiRequest_1.ApiRequestType.Delete;
    try {
        api.buildQuery(request);
        t.ok(false, "an invalid query should not succeed");
        t.end();
    }
    catch (e) {
        t.ok(e instanceof ApiEdgeError_1.ApiEdgeError);
        t.equal(e.status, 400);
        t.equal(e.message, 'Invalid Delete Query');
        t.end();
    }
});
tap.test('PATCH /schools/s2', function (t) {
    var request = api.parseRequest(['schools', 's2']);
    request.type = ApiRequest_1.ApiRequestType.Patch;
    request.body = {
        name: "Cool School"
    };
    var query = api.buildQuery(request);
    t.equal(query.steps.length, 4, 'should build a 4 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.ExtendContextLiveQueryStep, 'EXTEND');
    t.ok(query.steps[2] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[3] instanceof builder.QueryEdgeQueryStep, 'QUERY');
    query.execute()
        .then(function (resp) {
        t.same(resp.data, {
            address: "12, Test street, North Pole, HA23535",
            id: "s2",
            name: "Cool School",
            phone: "456345283"
        });
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function () {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
tap.test('PUT /schools/s2', function (t) {
    var request = api.parseRequest(['schools', 's2']);
    request.type = ApiRequest_1.ApiRequestType.Update;
    request.body = {
        name: "Cool School"
    };
    var query = api.buildQuery(request);
    t.equal(query.steps.length, 4, 'should build a 4 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.ExtendContextLiveQueryStep, 'EXTEND');
    t.ok(query.steps[2] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[3] instanceof builder.QueryEdgeQueryStep, 'QUERY');
    query.execute()
        .then(function (resp) {
        t.same(resp.data, {
            id: "s2",
            name: "Cool School",
            address: null,
            phone: null
        });
        t.equal(resp.metadata, null);
        t.end();
    })
        .catch(function () {
        t.ok(false, "a valid query should not fail");
        t.end();
    });
});
tap.test('GET /students/s2/rename', function (t) {
    var request = api.parseRequest(['students', 's2', 'rename']);
    request.type = ApiRequest_1.ApiRequestType.Read;
    try {
        api.buildQuery(request);
        t.ok(false, 'an invalid query should not succeed');
    }
    catch (e) {
        t.ok(e instanceof ApiEdgeError_1.ApiEdgeError);
        t.equal(e.message, 'Method Not Allowed');
        t.equal(e.status, 405);
    }
    t.end();
});
tap.test('/students/s2/withHungarianName', function (t) {
    var request = api.parseRequest(['students', 's2', 'withHungarianName']), query = api.buildQuery(request);
    t.equal(query.steps.length, 5, 'should build an 5 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextLiveQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');
    t.ok(query.steps[2] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[3] instanceof builder.ProvideIdQueryStep, 'PROVIDE ID');
    t.ok(query.steps[4] instanceof builder.CallMethodQueryStep, 'call{withHungarianName}');
    query.execute()
        .then(function (resp) {
        t.same(resp.data, {
            id: "s2",
            fullName: "Dave Test",
            hungarianName: "Test Dave",
            email: "dave.test@gmail.com",
            schoolId: "s1",
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
tap.test('POST /students/s2/rename', function (t) {
    var request = api.parseRequest(['students', 's2', 'rename']);
    request.type = ApiRequest_1.ApiRequestType.Update;
    request.body = { name: "Test David" };
    var query = api.buildQuery(request);
    t.equal(query.steps.length, 5, 'should build a 4 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.SetResponseQueryStep, 'SET RESPONSE');
    t.ok(query.steps[2] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[3] instanceof builder.ProvideIdQueryStep, 'PROVIDE ID');
    t.ok(query.steps[4] instanceof builder.CallMethodQueryStep, 'call{rename}');
    query.execute()
        .then(function (resp) {
        t.same(resp.data, {
            id: "s2",
            fullName: "David Test",
            email: "dave.test@gmail.com",
            schoolId: "s1",
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
//# sourceMappingURL=query-builder.js.map