const tap = require('tap');

import * as request from "../src/request/ApiRequest";

import {ApiEdgeMethod, ApiEdgeMethodScope} from "../src/edge/ApiEdgeMethod";
import {ApiRequestPathParser, ApiRequestParser} from "../src/request/ApiRequestParser";
import {OneToManyRelation} from "../src/relations/OneToManyRelation";
import {OneToOneRelation} from "../src/relations/OneToOneRelation";
import {Api} from "../src/Api";

const entryMethod = () => { return new Promise((resolve, reject) => reject("entry")) };
const relatedEntryMethod = () => { return new Promise((resolve, reject) => reject("entry")) };
const collectionMethod = () => { return new Promise((resolve, reject) => reject("collection")) };
const edgeMethod = () => { return new Promise((resolve, reject) => reject("edge")) };

const edge1: any = function() {
    this.name = "entry";
    this.pluralName = "entries";
    this.relations = [];
    this.methods = [
        new ApiEdgeMethod("entryMethod", entryMethod, ApiEdgeMethodScope.Entry),
        new ApiEdgeMethod("collectionMethod", collectionMethod, ApiEdgeMethodScope.Collection),
        new ApiEdgeMethod("method", edgeMethod, ApiEdgeMethodScope.Edge)
    ]
};

const edge2: any = function() {
    this.name = "relatedEntry";
    this.pluralName = "relatedEntries";
    this.relations = [];
    this.methods = [
        new ApiEdgeMethod("relatedEntryMethod", relatedEntryMethod, ApiEdgeMethodScope.Entry),
        new ApiEdgeMethod("relatedCollectionMethod", collectionMethod, ApiEdgeMethodScope.Collection),
        new ApiEdgeMethod("relatedMethod", edgeMethod, ApiEdgeMethodScope.Edge)
    ]
};

const edge3: any = function() {
    this.name = "relatedCollectionEntry";
    this.pluralName = "relatedCollection";
    this.relations = [];
    this.methods = [
        new ApiEdgeMethod("relatedEntryMethod", entryMethod, ApiEdgeMethodScope.Entry),
        new ApiEdgeMethod("relatedCollectionMethod", collectionMethod, ApiEdgeMethodScope.Collection),
        new ApiEdgeMethod("relatedMethod", edgeMethod, ApiEdgeMethodScope.Edge)
    ]
};

const edge: any = new edge1;
const relatedEdge: any = new edge2;
const relatedCollectionEdge: any = new edge3;
const relation: any = new OneToOneRelation(edge, relatedEdge);
const collectionRelation: any = new OneToManyRelation(edge, relatedCollectionEdge);

const parser = new ApiRequestPathParser(
    new Api('1.0')
        .edge(edge)
        .edge(relatedEdge)
        .edge(relatedCollectionEdge)
        .relation(relation)
        .relation(collectionRelation)
);

tap.test('path should be empty when the input array is empty', (t: any) => {
    const path = parser.parse([]);
    t.equal(path.segments.length, 0);
    t.end()
});

tap.test('parser should not allow missing edges', (t: any) => {
    t.throws(() => { parser.parse([ 'test' ]) }, 'Missing Edge: test', 'should not allow missing start edge');
    t.throws(() => { parser.parse([ 'entries', '42', 'test' ]) }, 'Missing Edge: test', 'should not allow missing related field/method 1');
    t.throws(() => { parser.parse([ 'entries', '42', 'relatedField', 'test' ]) }, 'Missing Edge: test', 'should not allow missing related field/method 2');
    t.throws(() => { parser.parse([ 'entries', '42', 'relatedField', 'relatedCollection' ]) }, 'Missing Relation: relatedEntry -> relatedCollection', 'should not allow missing relation');
    t.throws(() => { parser.parse([ 'entries', '42', 'relatedCollection', '11', 'test' ]) }, 'Missing Relation: relatedCollection -> test', 'should not allow missing related relation');

    t.end()
});

tap.test('parser should not allow invalid methods', (t: any) => {
    t.throws(() => { parser.parse([ 'entries', '42', 'collectionMethod' ]) }, 'Missing Relation/Method: entries -> collectionMethod', 'should not allow collection method on entry segment');
    t.throws(() => { parser.parse([ 'entries', '42', 'relatedField', 'relatedCollectionMethod' ]) }, 'Missing Relation/Method: entries -> relatedCollectionMethod', 'should not allow collection method on a related entry segment');

    //TODO: These should produce entry requests.
    //t.throws(() => { parser.parse([ 'entries', '42', 'relatedCollection', 'relatedEntryMethod' ]) }, 'Missing Relation/Method: entries -> relatedEntryMethod', 'should not allow entry method on a related collection segment');
    //t.throws(() => { parser.parse([ 'entries', 'entryMethod' ]) }, 'Missing Relation/Method: entries -> entryMethod', 'should not allow entry method on collection segment');

    t.end()
});

tap.test('parser should parse single edge segment request', (t: any) => {
    const path = parser.parse([ 'entries' ]);
    t.equal(path.segments.length, 1, 'should have one segment');
    t.ok(path.segments[0] instanceof request.EdgePathSegment, 'should have an edge path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal(path.segments[0].relation, null, 'should have no relation');
    t.end()
});

tap.test('parser should parse single entry segment request', (t: any) => {
    const path = parser.parse([ 'entries', '42' ]);
    t.equal(path.segments.length, 1, 'should have one segment');
    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal((path.segments[0] as request.EntryPathSegment).id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');
    t.end()
});

tap.test('parser should parse single edge method segment request', (t: any) => {
    const path = parser.parse([ 'entries', 'method' ]);
    t.equal(path.segments.length, 1, 'should have one segment');
    t.ok(path.segments[0] instanceof request.MethodPathSegment, 'should have a method path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal((path.segments[0] as request.MethodPathSegment).method.execute, edgeMethod, 'should be the registered method');
    t.end()
});

tap.test('parser should parse single related entry segment request', (t: any) => {
    const path = parser.parse([ 'entries', '42', 'relatedEntry' ]);
    t.equal(path.segments.length, 2, 'should have two segments');

    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal((path.segments[0] as request.EntryPathSegment).id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');

    t.ok(path.segments[1] instanceof request.RelatedFieldPathSegment, 'should have a related field path segment');
    t.equal(path.segments[1].edge, edge, 'should be the registered edge');
    t.equal(path.segments[1].relation, relation, 'should be the registered relation');

    t.end()
});

tap.test('parser should parse single entry method segment request', (t: any) => {
    const path = parser.parse([ 'entries', '42', 'entryMethod' ]);
    t.equal(path.segments.length, 2, 'should have two segments');

    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal((path.segments[0] as request.EntryPathSegment).id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');

    t.ok(path.segments[1] instanceof request.MethodPathSegment, 'should have a method path segment');
    t.equal(path.segments[1].edge, edge, 'should be the registered edge');
    t.equal((path.segments[1] as request.MethodPathSegment).method.execute, entryMethod, 'should be the registered method');

    t.end()
});

tap.test('parser should parse single related entry method segment request', (t: any) => {
    const path = parser.parse([ 'entries', '42', 'relatedEntry', 'relatedEntryMethod' ]);
    t.equal(path.segments.length, 3, 'should have two segments');

    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal((path.segments[0] as request.EntryPathSegment).id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');

    t.ok(path.segments[1] instanceof request.RelatedFieldPathSegment, 'should have a related field path segment');
    t.equal(path.segments[1].edge, edge, 'should be the registered edge');
    t.equal(path.segments[1].relation, relation, 'should be the registered relation');

    t.ok(path.segments[2] instanceof request.MethodPathSegment, 'should have a method path segment');
    t.equal(path.segments[2].edge, relatedEdge, 'should be the registered edge');
    t.equal((path.segments[2] as request.MethodPathSegment).method.execute, relatedEntryMethod, 'should be the registered method');

    t.end()
});

tap.test('parser should parse single related collection segment request', (t: any) => {
    const path = parser.parse([ 'entries', '42', 'relatedCollection' ]);
    t.equal(path.segments.length, 2, 'should have two segments');

    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal((path.segments[0] as request.EntryPathSegment).id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');

    t.ok(path.segments[1] instanceof request.EdgePathSegment, 'should have an edge path segment');
    t.equal(path.segments[1].edge, relatedCollectionEdge, 'should be the registered edge');
    t.equal(path.segments[1].relation, collectionRelation, 'should be the registered relation');

    t.end()
});

tap.test('unsupported relation should cause error', (t: any) => {
    const unsupportedRelation: any = function() {
        this.name = "unsupported";
        this.from = edge;
        this.to = relatedEdge;
    };

    const badParser = new ApiRequestPathParser(
        new Api('1.0')
            .edge(edge)
            .edge(relatedEdge)
            .relation(new unsupportedRelation)
    );

    t.throws(() => { badParser.parse([ 'entries', '42', 'unsupported' ]) }, 'Unsupported Relation');
    t.end()
});

tap.test('request parser should work too', (t: any) => {
    const requestParser = new ApiRequestParser(new Api('1.0'));
    const request = requestParser.parse([]);
    t.equal(request.path.segments.length, 0);
    t.end()
});