import {ApiEdgeError} from "../src/query/ApiEdgeError";
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
import {ApiRequestType, ApiRequest} from "../src/request/ApiRequest";

const studentEdge = new StudentEdge,
    classEdge = new ClassEdge,
    courseEdge = new CourseEdge,
    courseTypeEdge = new CourseTypeEdge,
    schoolEdge = new SchoolEdge;

var api: Api;

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

tap.test('Any type queries should fail', (t: any) => {
    try {
        let request = new ApiRequest();
        request.type = ApiRequestType.Any;
        api.buildQuery(request);
        t.ok(false, 'an invalid query should not succeed');
    }
    catch(e) {
        t.ok(e instanceof ApiEdgeError);
        t.equal(e.message, 'Unsupported Query Type');
        t.equal(e.status, 400);
    }
    t.end()
});

tap.test('Change type queries should fail', (t: any) => {
    try {
        let request = new ApiRequest();
        request.type = ApiRequestType.Change;
        api.buildQuery(request);
        t.ok(false, 'an invalid query should not succeed');
    }
    catch(e) {
        t.ok(e instanceof ApiEdgeError);
        t.equal(e.message, 'Unsupported Query Type');
        t.equal(e.status, 400);
    }
    t.end()
});

tap.test('/schools', (t: any) => {
    const request = api.parseRequest([ 'schools' ]),
        query = api.buildQuery(request);

    t.equal(query.steps.length, 2, 'should build a 2 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep);
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep);

    query.execute()
        .then(resp => {
            t.same(resp.data,
                [
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
            t.end()
        })
        .catch((e) => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('/schools/s2', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2' ]),
        query = api.buildQuery(request);

    t.equal(query.steps.length, 3, 'should build a 3 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep);
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep);
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep);

    query.execute()
        .then(resp => {
            t.same(resp.data,
                {
                    address: "12, Test street, North Pole, HA23535",
                    id: "s2",
                    name: "Second School",
                    phone: "456345283"
                });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('/schools/s5', (t: any) => {
    const request = api.parseRequest([ 'schools', 's5' ]),
        query = api.buildQuery(request);

    query.execute()
        .then(() => {
            t.ok(false, "an invalid query should not succeed");
            t.end()
        })
        .catch(e => {
            t.ok(e instanceof ApiEdgeError);
            t.equal(e.status, 404);
            t.equal(e.message, 'Not Found');
            t.end()
        });
});

tap.test('/schools/s1/classes', (t: any) => {
    const request = api.parseRequest([ 'schools', 's1', 'classes' ]),
        query = api.buildQuery(request);

    t.equal(query.steps.length, 5, 'should build a 5 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[2] instanceof builder.RelateQueryStep, 'RELATE schoolId');
    t.ok(query.steps[3] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[4] instanceof builder.QueryEdgeQueryStep, 'QUERY /classes');

    query.execute()
        .then(resp => {
            t.same(resp.data,
                [
                    {
                        id: "c1",
                        name: "A",
                        semester: 1,
                        room: "Room 1",
                        schoolId: "s1"
                    }
                ]);
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('/schools/s1/classes/c1', (t: any) => {
    const request = api.parseRequest([ 'schools', 's1', 'classes', 'c1' ]),
        query = api.buildQuery(request);

    t.equal(query.steps.length, 6, 'should build a 6 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep, 'QUERY /schools');
    t.ok(query.steps[2] instanceof builder.RelateQueryStep, 'RELATE schoolId');
    t.ok(query.steps[3] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[4] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[5] instanceof builder.QueryEdgeQueryStep, 'QUERY /classes');

    query.execute()
        .then(resp => {
            t.same(resp.data,
                {
                    id: "c1",
                    name: "A",
                    semester: 1,
                    room: "Room 1",
                    schoolId: "s1"
                });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('/students/s2/class', (t: any) => {
    const request = api.parseRequest([ 'students', 's2', 'class' ]),
        query = api.buildQuery(request);

    t.equal(query.steps.length, 5, 'should build a 5 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');
    t.ok(query.steps[2] instanceof builder.ProvideIdQueryStep, 'PROVIDE ID: classId');
    t.ok(query.steps[3] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[4] instanceof builder.QueryEdgeQueryStep, 'QUERY /classes');

    query.execute()
        .then(resp => {
            t.same(resp.data, {
                id: "c1",
                name: "A",
                semester: 1,
                room: "Room 1",
                schoolId: "s1"
            });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('/schools/s1/classes/c2', (t: any) => {
    const request = api.parseRequest([ 'schools', 's1', 'classes', 'c2' ]),
        query = api.buildQuery(request);

    query.execute()
        .then(() => {
            t.ok(false, "an invalid query should not succeed");
            t.end()
        })
        .catch(e => {
            t.ok(e instanceof ApiEdgeError);
            t.equal(e.status, 404);
            t.equal(e.message, 'Not Found');
            t.end()
        });
});

tap.test('POST /schools', (t: any) => {
    const request = api.parseRequest([ 'schools' ]);
    request.type = ApiRequestType.Create;
    const body = request.body = {
        address: "12, Test street, North Pole, HA23535",
        id: "s3",
        name: "Third School",
        phone: "456345283"
    };
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 2, 'should build a 2 step query');
    t.ok(query.steps[0] instanceof builder.SetBodyQueryStep);
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep);

    query.execute()
        .then(resp => {
            t.same(resp.data, body);
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('DELETE /schools/s3', (t: any) => {
    const request = api.parseRequest([ 'schools', 's3' ]);
    request.type = ApiRequestType.Delete;
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 3, 'should build a 3 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep);
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep);
    t.ok(query.steps[2] instanceof builder.QueryEdgeQueryStep);

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

tap.test('DELETE /students/s2/class', (t: any) => {
    const request = api.parseRequest([ 'students', 's2', 'class' ]);
    request.type = ApiRequestType.Delete;

    try {
        api.buildQuery(request);
        t.ok(false, "an invalid query should not succeed");
        t.end()
    }
    catch(e) {
        t.ok(e instanceof ApiEdgeError);
        t.equal(e.status, 400);
        t.equal(e.message, 'Invalid Delete Query');
        t.end()
    }
});

tap.test('PATCH /schools/s2', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2' ]);
    request.type = ApiRequestType.Patch;
    request.body = {
        name: "Cool School"
    };
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 4, 'should build a 4 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[2] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[3] instanceof builder.QueryEdgeQueryStep, 'QUERY');

    query.execute()
        .then(resp => {
            t.same(resp.data,
                {
                    address: "12, Test street, North Pole, HA23535",
                    id: "s2",
                    name: "Cool School",
                    phone: "456345283"
                });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('PUT /schools/s2', (t: any) => {
    const request = api.parseRequest([ 'schools', 's2' ]);
    request.type = ApiRequestType.Update;
    request.body = {
        name: "Cool School"
    };
    const query = api.buildQuery(request);

    t.equal(query.steps.length, 4, 'should build a 4 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[2] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[3] instanceof builder.QueryEdgeQueryStep, 'QUERY');

    query.execute()
        .then(resp => {
            t.same(resp.data,
                {
                    id: "s2",
                    name: "Cool School",
                    address: null,
                    phone: null
                });
            t.equal(resp.metadata, null);
            t.end()
        })
        .catch(() => {
            t.ok(false, "a valid query should not fail");
            t.end()
        });
});

tap.test('GET /students/s2/rename', (t: any) => {
    const request = api.parseRequest([ 'students', 's2', 'rename' ]);
    request.type = ApiRequestType.Read;

    try {
        api.buildQuery(request);
        t.ok(false, 'an invalid query should not succeed')
    }
    catch(e) {
        t.ok(e instanceof ApiEdgeError);
        t.equal(e.message, 'Method Not Allowed');
        t.equal(e.status, 405);
    }
    t.end()
});

tap.test('/students/s2/withFullName', (t: any) => {
    const request = api.parseRequest([ 'students', 's2', 'withFullName' ]),
        query = api.buildQuery(request);

    t.equal(query.steps.length, 5, 'should build an 5 step query');
    t.ok(query.steps[0] instanceof builder.ExtendContextQueryStep, 'EXTEND');
    t.ok(query.steps[1] instanceof builder.QueryEdgeQueryStep, 'QUERY /students');
    t.ok(query.steps[2] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[3] instanceof builder.ProvideIdQueryStep, 'PROVIDE ID');
    t.ok(query.steps[4] instanceof builder.CallMethodQueryStep, 'call{withFullName}');

    query.execute()
        .then(resp => {
            t.same(resp.data, {
                id: "s2",
                firstName: "Dave",
                lastName: "Test",
                fullName: "Dave Test",
                email: "dave.test@gmail.com",
                phone: "347633445",
                schoolId: "s1",
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

tap.test('POST /students/s2/rename', (t: any) => {
    const request = api.parseRequest([ 'students', 's2', 'rename' ]);
    request.type = ApiRequestType.Update;
    request.body = { name: "David Test" };

    const query = api.buildQuery(request);

    t.equal(query.steps.length, 5, 'should build a 4 step query');
    t.ok(query.steps[0] instanceof builder.SetResponseQueryStep, 'SET RESPONSE');
    t.ok(query.steps[1] instanceof builder.ExtendContextQueryStep, 'APPLY PARAMS');
    t.ok(query.steps[2] instanceof builder.SetBodyQueryStep, 'SET BODY');
    t.ok(query.steps[3] instanceof builder.ProvideIdQueryStep, 'PROVIDE ID');
    t.ok(query.steps[4] instanceof builder.CallMethodQueryStep, 'call{rename}');

    query.execute()
        .then(resp => {
            t.same(resp.data, {
                id: "s2",
                firstName: "David",
                lastName: "Test",
                email: "dave.test@gmail.com",
                phone: "347633445",
                schoolId: "s1",
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