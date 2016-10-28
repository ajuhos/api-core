const tap = require('tap');

import * as request from "../src/request/ApiRequest";
import {ApiRequestPathParser, ApiRequestParser} from "../src/request/ApiRequestParser";
import {OneToManyRelation} from "../src/relations/OneToManyRelation";
import {OneToOneRelation} from "../src/relations/OneToOneRelation";
import {Api} from "../src/Api";

const edge1: any = function() {
    this.name = "entry";
    this.pluralName = "entries";
    this.relations = [];
};

const edge2: any = function() {
    this.name = "relatedEntry";
    this.pluralName = "relatedEntries";
    this.relations = [];
};

const edge3: any = function() {
    this.name = "relatedCollectionEntry";
    this.pluralName = "relatedCollection";
    this.relations = [];
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
    var path = parser.parse([]);
    t.equal(path.segments.length, 0);
    t.end()
});

tap.test('parser should not allow missing edges', (t: any) => {
    t.throws(() => { parser.parse([ 'test' ]) }, 'Missing Edge: test', 'should not allow missing start edge');
    t.throws(() => { parser.parse([ 'entries', '42', 'test' ]) }, 'Missing Edge: test', 'should not allow missing related field/method 1');
    t.throws(() => { parser.parse([ 'entries', '42', 'relatedField', 'test' ]) }, 'Missing Edge: test', 'should not allow missing related field/method 2');
    t.throws(() => { parser.parse([ 'entries', '42', 'relatedField', 'relatedCollection' ]) }, 'Missing Relation: relatedEntry -> relatedCollection', 'should not allow missing relation');
    t.end()
});

tap.test('parser should parse single edge segment request', (t: any) => {
    var path = parser.parse([ 'entries' ]);
    t.equal(path.segments.length, 1, 'should have one segment');
    t.ok(path.segments[0] instanceof request.EdgePathSegment, 'should have an edge path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal(path.segments[0].relation, null, 'should have no relation');
    t.end()
});

tap.test('parser should parse single entry segment request', (t: any) => {
    var path = parser.parse([ 'entries', '42' ]);
    t.equal(path.segments.length, 1, 'should have one segment');
    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal((path.segments[0] as request.EntryPathSegment).id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');
    t.end()
});

tap.test('parser should parse single related entry segment request', (t: any) => {
    var path = parser.parse([ 'entries', '42', 'relatedEntry' ]);
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

tap.test('parser should parse single related collection segment request', (t: any) => {
    var path = parser.parse([ 'entries', '42', 'relatedCollection' ]);
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
    var unsupportedRelation: any = function() {
        this.name = "unsupported";
        this.from = edge;
        this.to = relatedEdge;
    };

    var badParser = new ApiRequestPathParser(
        new Api('1.0')
            .edge(edge)
            .edge(relatedEdge)
            .relation(new unsupportedRelation)
    );

    t.throws(() => { badParser.parse([ 'entries', '42', 'unsupported' ]) }, 'Unsupported Relation');
    t.end()
});

tap.test('request parser should work too', (t: any) => {
    var requestParser = new ApiRequestParser(new Api('1.0'));
    var request = requestParser.parse([]);
    t.equal(request.path.segments.length, 0);
    t.end()
});