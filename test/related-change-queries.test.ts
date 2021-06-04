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
        .relation(new OneToOneRelation(studentEdge, schoolEdge))
        .relation(new OneToOneRelation(classEdge, schoolEdge))
        .relation(new OneToOneRelation(courseEdge, classEdge))
        .relation(new OneToManyRelation(classEdge, studentEdge))
        .relation(new OneToManyRelation(classEdge, courseEdge))
        .relation(new OneToManyRelation(schoolEdge, studentEdge))
        .relation(new OneToManyRelation(schoolEdge, classEdge));
});

test('POST /schools/s2/students', async () => {
    const request = await api.parseRequest([ 'schools', 's2', 'students' ]);
    request.type = ApiRequestType.Create;
    request.body = {
        id: "s7",
        fullName: "Marry Test",
        email: "marry.test@gmail.com",
        classId: "c1"
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(5);//'should build a 5 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//'SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[2]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /schools');
    expect(query.steps[3]).toBeInstanceOf(builder.RelateBackwardsChangeQueryStep);//'RELATE CHANGE schoolId');
    expect(query.steps[4]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /students');

    return expect(query.execute()).resolves.toEqual( 
        {   
            data: {
                id: "s7",
                fullName: "Marry Test",
                email: "marry.test@gmail.com",
                schoolId: "s2",
                classId: "c1"
            }, 
            metadata: null
        });
});

test('POST /schools/s2/classes/c1/students', async () => {
    const request = await api.parseRequest([ 'schools', 's2', 'classes', 'c1', 'students' ]);
    request.type = ApiRequestType.Create;
    request.body = {
        id: "s8",
        fullName: "Adam Test",
        email: "adam.test@gmail.com"
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(7);//'should build a 8 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//'SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.SetResponseQueryStep);
    expect(query.steps[2]).toBeInstanceOf(builder.RelateBackwardsChangeQueryStep);
    expect(query.steps[3]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);
    expect(query.steps[4]).toBeInstanceOf(builder.QueryEdgeQueryStep);
    expect(query.steps[5]).toBeInstanceOf(builder.RelateBackwardsChangeQueryStep);
    expect(query.steps[6]).toBeInstanceOf(builder.QueryEdgeQueryStep);

    return expect(query.execute()).resolves.toEqual( 
        {
            data:{
                id: "s8",
                fullName: "Adam Test",
                email: "adam.test@gmail.com",
                schoolId: "s2",
                classId: "c1"
            }, 
            metadata: null
        });
});

test('POST /schools/s2/students (invalid body)', async () => {
    const request = await api.parseRequest([ 'schools', 's2', 'students' ]);
    request.type = ApiRequestType.Create;
    request.body = {
        id: "s7",
        fullName: "Marry Test",
        email: "marry.test@gmail.com",
        classId: "c1",
        schoolId: "s3"
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(5);//'should build a 5 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//'SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[2]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /schools');
    expect(query.steps[3]).toBeInstanceOf(builder.RelateBackwardsChangeQueryStep);//'RELATE CHANGE schoolId');
    expect(query.steps[4]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /students');

    return expect(query.execute()).resolves.toEqual( 
    { 
        data: {
            id: "s7",
            fullName: "Marry Test",
            email: "marry.test@gmail.com",
            schoolId: "s2",
            classId: "c1"
        }, 
        metadata: null
    })
});

test('POST /schools/s2/classes/c1/students (invalid body)', async () => {
    const request = await api.parseRequest([ 'schools', 's2', 'classes', 'c1', 'students' ]);
    request.type = ApiRequestType.Create;
    request.body = {
        id: "s8",
        fullName: "Adam Test",
        email: "adam.test@gmail.com",
        classId: "c2",
        schoolId: "s3"
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(7);//'should build a 8 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//'SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.SetResponseQueryStep);//'EXTEND');
    expect(query.steps[2]).toBeInstanceOf(builder.RelateBackwardsChangeQueryStep);//'QUERY /schools');
    expect(query.steps[3]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'RELATE CHANGE schoolId');
    expect(query.steps[4]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'EXTEND');
    expect(query.steps[5]).toBeInstanceOf(builder.RelateBackwardsChangeQueryStep);//'QUERY /classes');
    expect(query.steps[6]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'RELATE CHANGE classId');

    return expect(query.execute()).resolves.toEqual( 
        {
            data: {
                id: "s8",
                fullName: "Adam Test",
                email: "adam.test@gmail.com",
                schoolId: "s2",
                classId: "c1"
            }, metadata: null
        });
});

test('PATCH /schools/s2/students/s7', async () => {
    const request = await api.parseRequest([ 'schools', 's2', 'students', 's7' ]);
    request.type = ApiRequestType.Patch;
    request.body = {
        fullName: "Merry Test",
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(8);//'should build a 8 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//'SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[2]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /schools');
    expect(query.steps[3]).toBeInstanceOf(builder.RelateBackwardsChangeQueryStep);//'RELATE CHANGE schoolId');
    expect(query.steps[4]).toBeInstanceOf(builder.RelateBackwardsQueryStep);//'RELATE schoolId');
    expect(query.steps[5]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND CONTEXT');
    expect(query.steps[6]).toBeInstanceOf(builder.ExtendContextQueryStep);//'APPLY PARAMS');
    expect(query.steps[7]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /students');

    return expect(query.execute()).resolves.toEqual( 
        {
            data: {
                id: "s7",
                fullName: "Merry Test",
                email: "marry.test@gmail.com",
                schoolId: "s2",
                classId: "c1"
            }, metadata: null
        });
});

test('PATCH /schools/s2/students/s7 (invalid body)', async () => {
    const request = await api.parseRequest([ 'schools', 's2', 'students', 's7' ]);
    request.type = ApiRequestType.Patch;
    request.body = {
        fullName: "Merry Test",
        schoolId: "s3"
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(8);//'should build a 8 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//'SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[2]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /schools');
    expect(query.steps[3]).toBeInstanceOf(builder.RelateBackwardsChangeQueryStep);//'RELATE CHANGE schoolId');
    expect(query.steps[4]).toBeInstanceOf(builder.RelateBackwardsQueryStep);//'RELATE schoolId');
    expect(query.steps[5]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND CONTEXT');
    expect(query.steps[6]).toBeInstanceOf(builder.ExtendContextQueryStep);//'APPLY PARAMS');
    expect(query.steps[7]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /students');

    return expect(query.execute()).resolves.toEqual( 
        {
            data: {
                id: "s7",
                fullName: "Merry Test",
                email: "marry.test@gmail.com",
                schoolId: "s2",
                classId: "c1"
            }, metadata: null
        });
});

test('PUT /schools/s2/students/s7', async () => {
    const request = await api.parseRequest([ 'schools', 's2', 'students', 's7' ]);
    request.type = ApiRequestType.Update;
    request.body = {
        id: "s7",
        fullName: "Merry Test",
        email: "merry.test@gmail.com",
        schoolId: "s2",
        classId: "c1"
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(8);//'should build a 8 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//'SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[2]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /schools');
    expect(query.steps[3]).toBeInstanceOf(builder.RelateBackwardsChangeQueryStep);//'RELATE CHANGE schoolId');
    expect(query.steps[4]).toBeInstanceOf(builder.RelateBackwardsQueryStep);//'RELATE schoolId');
    expect(query.steps[5]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND CONTEXT');
    expect(query.steps[6]).toBeInstanceOf(builder.ExtendContextQueryStep);//'APPLY PARAMS');
    expect(query.steps[7]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /students');

    return expect(query.execute()).resolves.toEqual( 
        {
            data: {
                    id: "s7",
                    fullName: "Merry Test",
                    email: "merry.test@gmail.com",
                    schoolId: "s2",
                    classId: "c1"
                }, metadata: null
            });
    });

test('PUT /schools/s2/students/s7 (invalid body)', async () => {
    const request = await api.parseRequest([ 'schools', 's2', 'students', 's7' ]);
    request.type = ApiRequestType.Update;
    request.body = {
        id: "s7",
        fullName: "Merry Test",
        email: "merry.test@gmail.com",
        schoolId: "s3",
        classId: "c1"
    };
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(8);//'should build a 8 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.SetBodyQueryStep);//'SET BODY');
    expect(query.steps[1]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[2]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /schools');
    expect(query.steps[3]).toBeInstanceOf(builder.RelateBackwardsChangeQueryStep);//'RELATE CHANGE schoolId');
    expect(query.steps[4]).toBeInstanceOf(builder.RelateBackwardsQueryStep);//'RELATE schoolId');
    expect(query.steps[5]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND CONTEXT');
    expect(query.steps[6]).toBeInstanceOf(builder.ExtendContextQueryStep);//'APPLY PARAMS');
    expect(query.steps[7]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /students');

    return expect(query.execute()).resolves.toEqual( 
        {
            data: {
                id: "s7",
                fullName: "Merry Test",
                email: "merry.test@gmail.com",
                schoolId: "s2",
                classId: "c1"
            }, metadata: null
        });
});

test('DELETE /schools/s2/students/s7', async () => {
    const request = await api.parseRequest([ 'schools', 's2', 'students', 's7' ]);
    request.type = ApiRequestType.Delete;
    const query = api.buildQuery(request);

    expect(query.steps.length).toBe(6);//'should build a 6 step query');
    expect(query.steps[0]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND');
    expect(query.steps[1]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /schools');
    expect(query.steps[2]).toBeInstanceOf(builder.RelateBackwardsQueryStep);//'RELATE schoolId');
    expect(query.steps[3]).toBeInstanceOf(builder.ExtendContextLiveQueryStep);//'EXTEND CONTEXT');
    expect(query.steps[4]).toBeInstanceOf(builder.ExtendContextQueryStep);//'APPLY PARAMS');
    expect(query.steps[5]).toBeInstanceOf(builder.QueryEdgeQueryStep);//'QUERY /students');

    return expect(query.execute()).resolves.toEqual(
        { 
            // why is data filled?
            data: {
                id: undefined,
                fullName: ' ',
                email: undefined,
                classId: undefined,
                schoolId: undefined,
            },
            metadata: null 
        })
});

