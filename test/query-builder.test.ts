import {ApiEdgeError} from "../src/query/ApiEdgeError";

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
test('creating the API should work', () => {
    api = new Api({name: 'test-service', version: '1.0'})
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
});

const expectToThrowApiError = (fn : () => {}, error: ApiEdgeError) => {
    try {
        fn();
        expect(true).toBe(false); //, 'an invalid query should not succeed');
    } catch(e) {
        expect(e).toStrictEqual(error);
    }
};

test('Any type queries should fail', () => {
    let request = new ApiRequest(api);
    request.type = ApiRequestType.Any;

    expectToThrowApiError( () => api.buildQuery(request), new ApiEdgeError(400, 'Unsupported Query Type'));
});

test('Change type queries should fail', () => {
    let request = new ApiRequest(api);
    request.type = ApiRequestType.Change;
 
    expectToThrowApiError( () => api.buildQuery(request), new ApiEdgeError(400, 'Unsupported Query Type'));
});

test('/schools', async () => {
    const request = await api.parseRequest([ 'schools' ]),
        query = api.buildQuery(request);
    expect(query.steps.length).toBe(2);//'should build a 2 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.ExtendContextQueryStep);
    expect(query.steps[1]).toBeInstanceOf(builder.QueryEdgeQueryStep);
    return expect(query.execute()).resolves.toEqual(
        {
            data: [
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
            ],
            metadata: null
        });
});

test('/schools/s2', async () => {
    const request = await api.parseRequest([ 'schools', 's2' ]),
        query = api.buildQuery(request);

    expect(query.steps.length).toBe(3);//'should build a 3 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextQueryStep);
    expect(query.steps[2]).toBeInstanceOf(builder.QueryEdgeQueryStep);
    return expect(query.execute()).resolves.toEqual(
        { 
            data:
            {
                    address: "12, Test street, North Pole, HA23535",
                    id: "s2",
                    name: "Second School",
                    phone: "456345283"
            },
            metadata: null
        });
});

test('/schools/s5', async () => {
    const request = await api.parseRequest([ 'schools', 's5' ]),
        query = api.buildQuery(request);

    return expect(query.execute).rejects.toEqual(
        {
            status: 404,
            message: 'Not Found'
        }
    )
});

test('/schools/s1/classes', async () => {
    const request = await api.parseRequest([ 'schools', 's1', 'classes' ]),
        query = api.buildQuery(request);

    expect(query.steps.length).toBe(5);//'should build a 5 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[1]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /schools');
    expect(query.steps[2]).toBeInstanceOf(builder.RelateBackwardsQueryStep);//'RELATE schoolId');
    expect(query.steps[3]).toBeInstanceOf(builder.ExtendContextQueryStep);//'APPLY PARAMS');
    expect(query.steps[4]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /classes');

    return expect(query.execute()).resolves.toEqual(
    { 
        data:
            [{
                id: "c1",
                name: "A",
                year: 1,
                room: "Room 1",
                schoolId: "s1"
            }],
        metadata: null
    });
})

test('/schools/s1/classes/c1', async () => {
    const request = await api.parseRequest([ 'schools', 's1', 'classes', 'c1' ]),
        query = api.buildQuery(request);

    expect(query.steps.length).toBe(6);//'should build a 6 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[1]).toBeInstanceOf(builder.QueryEdgeQueryStep);//QUERY /schools');
    expect(query.steps[2]).toBeInstanceOf(builder.RelateBackwardsQueryStep);//'RELATE schoolId');
    expect(query.steps[3]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[4]).toBeInstanceOf(builder.ExtendContextQueryStep);//'APPLY PARAMS');
    expect(query.steps[5]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /classes');

    return expect(query.execute()).resolves.toEqual(
        { 
            data:
            {
                id: "c1",
                name: "A",
                year: 1,
                room: "Room 1",
                schoolId: "s1"
            },
            metadata: null
        });
});

test('/students/s2/class', async () => {
    const request = await api.parseRequest([ 'students', 's2', 'class' ]),
        query = api.buildQuery(request);

    expect(query.steps.length).toBe(5);//'should build a 5 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[1]).toBeInstanceOf(builder.QueryEdgeQueryStep);//QUERY /students');
    expect(query.steps[2]).toBeInstanceOf(builder.ProvideIdQueryStep);//PROVIDE ID: classId');
    expect(query.steps[3]).toBeInstanceOf(builder.ExtendContextQueryStep);//APPLY PARAMS');
    expect(query.steps[4]).toBeInstanceOf(builder.QueryEdgeQueryStep);//QUERY /classes');

    return expect(query.execute()).resolves.toEqual(
        { 
            data:
            {
                id: "c1",
                name: "A",
                year: 1,
                room: "Room 1",
                schoolId: "s1"
            },
            metadata: null
        });
});

test('/schools/s1/classes/c2', async () => {
    const request = await api.parseRequest([ 'schools', 's1', 'classes', 'c2' ]),
        query = api.buildQuery(request);

    return expect(query.execute()).rejects.toEqual(
        {
            status: 404,
            message: 'Not Found'
        });
});

test('POST /schools', async () => {
    const request = await api.parseRequest([ 'schools' ]);
    request.type = ApiRequestType.Create;
    const body = request.body = {
        address: "12, Test street, North Pole, HA23535",
        id: "s3",
        name: "Third School",
        phone: "456345283"
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(2);//'should build a 2 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);
    expect(query.steps[1]).toBeInstanceOf(builder.QueryEdgeQueryStep);

    return expect(query.execute()).resolves.toEqual(
        {
            data: body,
            metadata: null
        });
});

test('DELETE /schools/s3', async () => {
    const request = await api.parseRequest([ 'schools', 's3' ]);
    request.type = ApiRequestType.Delete;
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(3);//'should build a 3 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextQueryStep);
    expect(query.steps[2]).toBeInstanceOf(builder.QueryEdgeQueryStep);

    return expect(query.execute()).resolves.toMatchObject({ metadata: null });
});

test('DELETE /students/s2/class', async () => {
    const request = await api.parseRequest([ 'students', 's2', 'class' ]);
    request.type = ApiRequestType.Delete;

    expectToThrowApiError(() => api.buildQuery(request), new ApiEdgeError(400, 'Invalid Delete Query'));
});

test('PATCH /schools/s2', async () => {
    const request = await api.parseRequest([ 'schools', 's2' ]);
    request.type = ApiRequestType.Patch;
    request.body = {
        name: "Cool School"
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(4);//'should build a 4 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//'SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[2]).toBeInstanceOf(builder.ExtendContextQueryStep);//'APPLY PARAMS');
    expect(query.steps[3]).toBeInstanceOf(builder.QueryEdgeQueryStep);//, 'QUERY');

    return expect(query.execute()).resolves.toEqual(
        { 
            data:
            {
                address: "12, Test street, North Pole, HA23535",
                id: "s2",
                name: "Cool School",
                phone: "456345283"
            },
            metadata: null
        });
    });

test('PUT /schools/s2', async () => {
    const request = await api.parseRequest([ 'schools', 's2' ]);
    request.type = ApiRequestType.Update;
    request.body = {
        name: "Cool School"
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(4);//'should build a 4 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[2]).toBeInstanceOf(builder.ExtendContextQueryStep);//APPLY PARAMS');
    expect(query.steps[3]).toBeInstanceOf(builder.QueryEdgeQueryStep);//QUERY');

    return expect(query.execute()).resolves.toEqual(
        { 
            data:
            {
                id: "s2",
                name: "Cool School",
                address: undefined,
                phone: undefined
            },
            metadata: null
        });
});

test('GET /students/s2/rename', async () => {
    const request = await api.parseRequest([ 'students', 's2', 'rename' ]);
    request.type = ApiRequestType.Read;

    expectToThrowApiError(() => api.buildQuery(request), 
        new ApiEdgeError(405, 'Method Not Allowed')
    );
});

test('/students/s2/withHungarianName', async () => {
    const request = await api.parseRequest([ 'students', 's2', 'withHungarianName' ]),
        query = api.buildQuery(request);

    expect(query.steps.length).toBe(5);//should build an 5 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[1]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /students');
    expect(query.steps[2]).toBeInstanceOf(builder.ExtendContextQueryStep);//, 'APPLY PARAMS');
    expect(query.steps[3]).toBeInstanceOf(builder.ProvideIdQueryStep);//'PROVIDE ID');
    expect(query.steps[4]).toBeInstanceOf(builder.CallMethodQueryStep);//'call{withHungarianName}');

    return expect(query.execute()).resolves.toEqual(
        { 
            data:
            {
                id: "s2",
                fullName: "Dave Test",
                hungarianName: "Test Dave",
                email: "dave.test@gmail.com",
                schoolId: "s1",
                classId: "c1"
            },
            metadata: null
        });
});

test('POST /students/s2/rename', async () => {
    const request = await api.parseRequest([ 'students', 's2', 'rename' ]);
    request.type = ApiRequestType.Update;
    request.body = { name: "Test David" };

    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(6);//'should build a 4 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'APPLY PARAMS');
    expect(query.steps[2]).toBeInstanceOf(builder.QueryEdgeQueryStep);//SET RESPONSE');
    expect(query.steps[3]).toBeInstanceOf(builder.ExtendContextQueryStep);//PROVIDE ID');
    expect(query.steps[4]).toBeInstanceOf(builder.ProvideIdQueryStep);//'call{rename}');

    return expect(query.execute()).resolves.toEqual(
        { 
            data:
            {
                id: "s2",
                fullName: "David Test",
                email: "dave.test@gmail.com",
                schoolId: "s1",
                classId: "c1"
            },
            metadata: null
        });
});
