import * as request from "../src/request/ApiRequest";

import {ApiEdgeQueryResponse} from "../src/edge/ApiEdgeQueryResponse";
import {ApiEdgeMethod, ApiEdgeMethodScope} from "../src/edge/ApiEdgeMethod";
import {ApiRequestPathParser, ApiRequestParser} from "../src/request/ApiRequestParser";
import {OneToManyRelation} from "../src/relations/OneToManyRelation";
import {OneToOneRelation} from "../src/relations/OneToOneRelation";
import {Api} from "../src/Api";
import { doesNotThrow } from "assert";
import { POINT_CONVERSION_COMPRESSED } from "constants";
import { ApiEdgeError } from "../src/query/ApiEdgeError";

const entryMethod = (): Promise<ApiEdgeQueryResponse> => { return new Promise((resolve, reject) => reject("entry")) };
const relatedEntryMethod = (): Promise<ApiEdgeQueryResponse> => { return new Promise((resolve, reject) => reject("entry")) };
const collectionMethod = (): Promise<ApiEdgeQueryResponse> => { return new Promise((resolve, reject) => reject("collection")) };
const edgeMethod = (): Promise<ApiEdgeQueryResponse> => { return new Promise((resolve, reject) => reject("edge")) };

const edge1: any = function() {
    this.name = "entry";
    this.pluralName = "entries";
    this.relations = [];
    this.methods = [
        new ApiEdgeMethod("entryMethod", entryMethod, ApiEdgeMethodScope.Entry),
        new ApiEdgeMethod("collectionMethod", collectionMethod, ApiEdgeMethodScope.Collection),
        new ApiEdgeMethod("method", edgeMethod, ApiEdgeMethodScope.Edge)
    ];
    this.resolve = () => Promise.resolve(true);
};

const edge2: any = function() {
    this.name = "relatedEntry";
    this.pluralName = "relatedEntries";
    this.relations = [];
    this.methods = [
        new ApiEdgeMethod("relatedEntryMethod", relatedEntryMethod, ApiEdgeMethodScope.Entry),
        new ApiEdgeMethod("relatedCollectionMethod", collectionMethod, ApiEdgeMethodScope.Collection),
        new ApiEdgeMethod("relatedMethod", edgeMethod, ApiEdgeMethodScope.Edge)
    ];
    this.resolve = () => Promise.resolve(true);
};

const edge3: any = function() {
    this.name = "relatedCollectionEntry";
    this.pluralName = "relatedCollection";
    this.relations = [];
    this.methods = [
        new ApiEdgeMethod("relatedEntryMethod", entryMethod, ApiEdgeMethodScope.Entry),
        new ApiEdgeMethod("relatedCollectionMethod", collectionMethod, ApiEdgeMethodScope.Collection),
        new ApiEdgeMethod("relatedMethod", edgeMethod, ApiEdgeMethodScope.Edge)
    ];
    this.resolve = () => Promise.resolve(true);
};

const edge: any = new edge1;
const relatedEdge: any = new edge2;
const relatedCollectionEdge: any = new edge3;
const relation: any = new OneToOneRelation(edge, relatedEdge);
const collectionRelation: any = new OneToManyRelation(edge, relatedCollectionEdge);

const parser = new ApiRequestPathParser(
    new Api({name: 'test-service', version: '1.0'})
        .edge(edge)
        .edge(relatedEdge)
        .edge(relatedCollectionEdge)
        .relation(relation)
        .relation(collectionRelation)
);

test('path should be empty when the input array is empty', async () => {
    const path = await parser.parse([]);
    expect(path.segments.length).toBe(0);
});

const expectToThrowApiError = async (fn : () => {}, error: ApiEdgeError) => {
    try {
        fn();
        expect(true).toBe(false); //, 'an invalid query should not succeed');
    } catch(e) {
        expect(e).toStrictEqual(error);
    }
};

describe('parser should not allow missing edges', () => {
    test('missing edge', async () => {
        return expect(() => parser.parse(['test'])).rejects.toStrictEqual(new ApiEdgeError(400, 'Missing Edge: test'));
    });

    test('Missing Relation/Method', async () => {
        return expect(() => parser.parse([ 'entries', '42', 'test' ])).rejects.toStrictEqual(new ApiEdgeError(400, 'Missing Relation/Method: entry -> test'));
    });

    test('Missing Relation/Method', async () => {
        return expect(() => parser.parse([ 'entries', '42', 'relatedField', 'test' ])).rejects.toStrictEqual(new ApiEdgeError(400, 'Missing Relation/Method: entry -> relatedField'));
    });

    test('Missing Relation', async () => {
        return expect(() => parser.parse([ 'entries', '42', 'relatedEntry', 'relatedCollection' ])).rejects.toStrictEqual(new ApiEdgeError(400, 'Missing Relation/Method: relatedEntry -> relatedCollection'));
    });

    test('Missing Relation/Method', async () => {
        expect(() => parser.parse([ 'entries', '42', 'relatedCollection', '11', 'test' ])).rejects.toStrictEqual(new ApiEdgeError(400, 'Missing Relation/Method: relatedCollectionEntry -> test'))
    });
});

describe('parser should not allow invalid methods', () => {
    test('Missing Relation/Method', async () => {
        return expect(() => parser.parse(['entries', '42', 'collectionMethod'])).rejects.toStrictEqual(new ApiEdgeError(400, 'Missing Relation/Method: entry -> collectionMethod'));
    });

    test('Missing Relation/Method', async () => {
        return expect(() => parser.parse([ 'entries', '42', 'relatedField' ])).rejects.toStrictEqual(new ApiEdgeError(400, 'Missing Relation/Method: entry -> relatedField'));
        //TODO: These should produce entry requests.
        //expect(() => { parser.parse([ 'entries', '42', 'relatedCollection', 'relatedEntryMethod' ]) }, 'Missing Relation/Method: entries -> relatedEntryMethod', 'should not allow entry method on a related collection segment');
        //expect(() => { parser.parse([ 'entries', 'entryMethod' ]) }, 'Missing Relation/Method: entries -> entryMethod', 'should not allow entry method on collection segment');
    });
});


test('parser should parse single edge segment request', async () => {
    const path = await parser.parse([ 'entries' ]);
    expect(path.segments.length).toBe(1);
    expect(path.segments[0]).toBeInstanceOf(request.EdgePathSegment);//, 'should have an edge path segment');
    expect(path.segments[0].edge).toBe(edge);//, 'should be the registered edge');
    expect(path.segments[0].relation).toBe(null);//, 'should have no relation');
});


test('parser should parse single entry segment request', async () => {
    const path = await parser.parse([ 'entries', '42' ]);
    expect(path.segments.length).toBe(1);//'should have one segment');
    expect(path.segments[0]).toBeInstanceOf(request.EntryPathSegment);//, 'should have an entry path segment');
    expect(path.segments[0].edge).toBe(edge)//, 'should be the registered edge');
    expect((path.segments[0] as request.EntryPathSegment).id).toBe('42')//, 'id should be the provided');
    expect(path.segments[0].relation).toBe(null)// 'should have no relation');
});

test('parser should parse single edge method segment request', async () => {
    const path = await parser.parse([ 'entries', 'method' ]);
    expect(path.segments.length).toBe(1);//'should have one segment');
    expect(path.segments[0]).toBeInstanceOf(request.MethodPathSegment);//'should have a method path segment');
    expect(path.segments[0].edge).toBe(edge);//'should be the registered edge');
    expect((path.segments[0] as request.MethodPathSegment).method.execute).toBe(edgeMethod);//'should be the registered method');
});

test('parser should parse single related entry segment request', async () => {
    const path = await parser.parse([ 'entries', '42', 'relatedEntry' ]);
    expect(path.segments.length).toBe(2);//'should have two segments');

    expect(path.segments[0]).toBeInstanceOf(request.EntryPathSegment);//, 'should have an entry path segment');
    expect(path.segments[0].edge).toBe(edge);//'should be the registered edge');
    expect((path.segments[0] as request.EntryPathSegment).id).toBe('42');//'id should be the provided');
    expect(path.segments[0].relation).toBe(null);//'should have no relation');

    expect(path.segments[1]).toBeInstanceOf(request.RelatedFieldPathSegment);//'should have a related field path segment');
    expect(path.segments[1].edge).toBe(edge);//'should be the registered edge');
    expect(path.segments[1].relation).toBe(relation);//'should be the registered relation');
});

test('parser should parse single entry method segment request', async () => {
    const path = await parser.parse([ 'entries', '42', 'entryMethod' ]);
    expect(path.segments.length).toBe(2);//, 'should have two segments');

    expect(path.segments[0]).toBeInstanceOf(request.EntryPathSegment);//'should have an entry path segment');
    expect(path.segments[0].edge).toBe(edge);//'should be the registered edge');
    expect((path.segments[0] as request.EntryPathSegment).id).toBe('42');//'id should be the provided');
    expect(path.segments[0].relation).toBe(null);//'should have no relation');

    expect(path.segments[1]).toBeInstanceOf(request.MethodPathSegment);//'should have a method path segment');
    expect(path.segments[1].edge).toBe(edge);//'should be the registered edge');
    expect((path.segments[1] as request.MethodPathSegment).method.execute).toBe(entryMethod);//'should be the registered method');
});

test('parser should parse single related entry method segment request', async () => {
    const path = await parser.parse([ 'entries', '42', 'relatedEntry', 'relatedEntryMethod' ]);
    expect(path.segments.length).toBe(3);//'should have two segments');

    expect(path.segments[0]).toBeInstanceOf(request.EntryPathSegment);//'should have an entry path segment');
    expect(path.segments[0].edge).toBe(edge);//'should be the registered edge');
    expect((path.segments[0] as request.EntryPathSegment).id).toBe('42');//'id should be the provided');
    expect(path.segments[0].relation).toBeNull();// 'should have no relation');

    expect(path.segments[1]).toBeInstanceOf(request.RelatedFieldPathSegment);//'should have a related field path segment');
    expect(path.segments[1].edge).toBe(edge);//'should be the registered edge');
    expect(path.segments[1].relation).toBe(relation);//'should be the registered relation');

    expect(path.segments[2]).toBeInstanceOf(request.MethodPathSegment);//'should have a method path segment');
    expect(path.segments[2].edge).toBe(relatedEdge);//'should be the registered edge');
    expect((path.segments[2] as request.MethodPathSegment).method.execute).toBe(relatedEntryMethod);//should be the registered method');
});

test('parser should parse single related collection segment request', async () => {
    const path = await parser.parse([ 'entries', '42', 'relatedCollection' ]);
    expect(path.segments.length).toBe(2);//'should have two segments');

    expect(path.segments[0]).toBeInstanceOf(request.EntryPathSegment);//'should have an entry path segment');
    expect(path.segments[0].edge).toBe(edge);//'should be the registered edge');
    expect((path.segments[0] as request.EntryPathSegment).id).toBe('42');//'id should be the provided');
    expect(path.segments[0].relation).toBeNull();//'should have no relation');

    expect(path.segments[1]).toBeInstanceOf(request.EdgePathSegment);//'should have an edge path segment');
    expect(path.segments[1].edge).toBe(relatedCollectionEdge);//'should be the registered edge');
    expect(path.segments[1].relation).toBe(collectionRelation);//'should be the registered relation');
});

test('unsupported relation should cause error', async () => {
    const unsupportedRelation: any = function() {
        this.name = "unsupported";
        this.from = edge;
        this.to = relatedEdge;
    };

    const badParser = new ApiRequestPathParser(
        new Api({name: 'test-service', version: '1.0'})
        .edge(edge)
            .edge(relatedEdge)
            .relation(new unsupportedRelation)
    );
    return expect(parser.parse([ 'entries', '42', 'unsupported' ])).rejects.toStrictEqual(new ApiEdgeError(400, 'Missing Relation/Method: entry -> unsupported'));
});

test('request parser should work too', async () => {
    const requestParser = new ApiRequestParser(new Api({name: 'test-service', version: '1.0'}));
    const request = await requestParser.parse([]);
    expect(request.path.segments.length).toBe(0);
});


