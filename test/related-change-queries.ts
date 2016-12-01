const tap = require('tap');

import {Api} from "../src/Api";
import * as builder from "../src/query/ApiQueryBuilder";
import {OneToOneRelation} from "../src/relations/OneToOneRelation";
import {OneToManyRelation} from "../src/relations/OneToManyRelation";

import {StudentEdge} from "./env/edges/StudentEdge";
import {ClassEdge} from "./env/edges/ClassEdge";
import {CourseEdge} from "./env/edges/CourseEdge";
import {CourseTypeEdge} from "./env/edges/CourseTypeEdge";
import {SchoolEdge} from "./env/edges/SchoolEdge";
import {ApiRequestType} from "../src/request/ApiRequest";

const studentEdge = new StudentEdge,
    classEdge = new ClassEdge,
    courseEdge = new CourseEdge,
    courseTypeEdge = new CourseTypeEdge,
    schoolEdge = new SchoolEdge;

let api: Api;

tap.test('creating the API should work', (t: any) => {
    api = new Api('1.0')
        .edge(studentEdge)
        .edge(classEdge)
        .edge(courseEdge)
        .edge(courseTypeEdge)
        .edge(schoolEdge)
        .relation(new OneToOneRelation(courseEdge, courseTypeEdge))
        .relation(new OneToManyRelation(courseTypeEdge, courseEdge))
        .relation(new OneToManyRelation(studentEdge, courseEdge))
        .relation(new OneToOneRelation(studentEdge, classEdge))
        .relation(new OneToOneRelation(classEdge, schoolEdge))
        .relation(new OneToOneRelation(courseEdge, classEdge))
        .relation(new OneToManyRelation(classEdge, studentEdge))
        .relation(new OneToManyRelation(classEdge, courseEdge))
        .relation(new OneToManyRelation(schoolEdge, studentEdge))
        .relation(new OneToManyRelation(schoolEdge, classEdge));

    t.end()
});

tap.test('POST /schools/s2/students', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2', 'students' ]);
    request.type = ApiRequestType.Create;
    request.body = {
        id: "s7",
        fullName: "Marry Test",
        email: "marry.test@gmail.com",
        classId: "c1"
    };
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 5, 'should build a 5 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[3] instanceof builder.RelateChangeQueryStep, 'RELATE CHANGE schoolId');
    t.ok(query.steps[4] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');

    query.execute()
        .then(resp => {
            t.same(resp.data, {
                id: "s7",
                fullName: "Marry Test",
                email: "marry.test@gmail.com",
                schoolId: "s2",
                classId: "c1"
            });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('POST /schools/s2/classes/c1/students', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2', 'classes', 'c1', 'students' ]);
    request.type = ApiRequestType.Create;
    request.body = {
        id: "s8",
        fullName: "Adam Test",
        email: "adam.test@gmail.com"
    };
    const query = api.buildQuery(request);

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
        .then(resp => {
            t.same(resp.data, {
                id: "s8",
                fullName: "Adam Test",
                email: "adam.test@gmail.com",
                schoolId: "s2",
                classId: "c1"
            });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('POST /schools/s2/students (invalid body)', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2', 'students' ]);
    request.type = ApiRequestType.Create;
    request.body = {
        id: "s7",
        fullName: "Marry Test",
        email: "marry.test@gmail.com",
        classId: "c1",
        schoolId: "s3"
    };
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 5, 'should build a 5 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[3] instanceof builder.RelateChangeQueryStep, 'RELATE CHANGE schoolId');
    t.ok(query.steps[4] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');

    query.execute()
        .then(resp => {
            t.same(resp.data, {
                id: "s7",
                fullName: "Marry Test",
                email: "marry.test@gmail.com",
                schoolId: "s2",
                classId: "c1"
            });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('POST /schools/s2/classes/c1/students (invalid body)', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2', 'classes', 'c1', 'students' ]);
    request.type = ApiRequestType.Create;
    request.body = {
        id: "s8",
        fullName: "Adam Test",
        email: "adam.test@gmail.com",
        classId: "c2",
        schoolId: "s3"
    };
    const query = api.buildQuery(request);

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
        .then(resp => {
            t.same(resp.data, {
                id: "s8",
                fullName: "Adam Test",
                email: "adam.test@gmail.com",
                schoolId: "s2",
                classId: "c1"
            });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('PATCH /schools/s2/students/s7', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2', 'students', 's7' ]);
    request.type = ApiRequestType.Patch;
    request.body = {
        fullName: "Merry Test",
    };
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 8, 'should build a 8 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[3] instanceof builder.RelateChangeQueryStep, 'RELATE CHANGE schoolId');
    t.ok(query.steps[4] instanceof builder.RelateQueryStep, 'RELATE schoolId');
    t.ok(query.steps[5] instanceof builder.ExtendContextQueryStep, 'EXTEND CONTEXT');
    t.ok(query.steps[6] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[7] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');

    query.execute()
        .then(resp => {
            t.same(resp.data,
                {
                    id: "s7",
                    fullName: "Merry Test",
                    email: "marry.test@gmail.com",
                    schoolId: "s2",
                    classId: "c1"
                });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('PATCH /schools/s2/students/s7 (invalid body)', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2', 'students', 's7' ]);
    request.type = ApiRequestType.Patch;
    request.body = {
        fullName: "Merry Test",
        schoolId: "s3"
    };
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 8, 'should build a 8 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[3] instanceof builder.RelateChangeQueryStep, 'RELATE CHANGE schoolId');
    t.ok(query.steps[4] instanceof builder.RelateQueryStep, 'RELATE schoolId');
    t.ok(query.steps[5] instanceof builder.ExtendContextQueryStep, 'EXTEND CONTEXT');
    t.ok(query.steps[6] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[7] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');

    query.execute()
        .then(resp => {
            t.same(resp.data,
                {
                    id: "s7",
                    fullName: "Merry Test",
                    email: "marry.test@gmail.com",
                    schoolId: "s2",
                    classId: "c1"
                });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('PUT /schools/s2/students/s7', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2', 'students', 's7' ]);
    request.type = ApiRequestType.Update;
    request.body = {
        id: "s7",
        fullName: "Merry Test",
        email: "merry.test@gmail.com",
        schoolId: "s2",
        classId: "c1"
    };
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 8, 'should build a 8 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[3] instanceof builder.RelateChangeQueryStep, 'RELATE CHANGE schoolId');
    t.ok(query.steps[4] instanceof builder.RelateQueryStep, 'RELATE schoolId');
    t.ok(query.steps[5] instanceof builder.ExtendContextQueryStep, 'EXTEND CONTEXT');
    t.ok(query.steps[6] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[7] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');

    query.execute()
        .then(resp => {
            t.same(resp.data,
                {
                    id: "s7",
                    fullName: "Merry Test",
                    email: "merry.test@gmail.com",
                    schoolId: "s2",
                    classId: "c1"
                });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('PUT /schools/s2/students/s7 (invalid body)', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2', 'students', 's7' ]);
    request.type = ApiRequestType.Update;
    request.body = {
        id: "s7",
        fullName: "Merry Test",
        email: "merry.test@gmail.com",
        schoolId: "s3",
        classId: "c1"
    };
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 8, 'should build a 8 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[3] instanceof builder.RelateChangeQueryStep, 'RELATE CHANGE schoolId');
    t.ok(query.steps[4] instanceof builder.RelateQueryStep, 'RELATE schoolId');
    t.ok(query.steps[5] instanceof builder.ExtendContextQueryStep, 'EXTEND CONTEXT');
    t.ok(query.steps[6] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[7] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');

    query.execute()
        .then(resp => {
            t.same(resp.data,
                {
                    id: "s7",
                    fullName: "Merry Test",
                    email: "merry.test@gmail.com",
                    schoolId: "s2",
                    classId: "c1"
                });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('DELETE /schools/s2/students/s7', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2', 'students', 's7' ]);
    request.type = ApiRequestType.Delete;
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 6, 'should build a 6 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[2] instanceof builder.RelateQueryStep, 'RELATE schoolId');
    t.ok(query.steps[3] instanceof builder.ExtendContextQueryStep, 'EXTEND CONTEXT');
    t.ok(query.steps[4] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[5] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');

    query.execute()
        .then(resp => {
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});