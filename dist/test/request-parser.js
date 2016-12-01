"use strict";
var tap = require('tap');
var request = require("../src/request/ApiRequest");
var ApiEdgeMethod_1 = require("../src/edge/ApiEdgeMethod");
var ApiRequestParser_1 = require("../src/request/ApiRequestParser");
var OneToManyRelation_1 = require("../src/relations/OneToManyRelation");
var OneToOneRelation_1 = require("../src/relations/OneToOneRelation");
var Api_1 = require("../src/Api");
var entryMethod = function () { return new Promise(function (resolve, reject) { return reject("entry"); }); };
var relatedEntryMethod = function () { return new Promise(function (resolve, reject) { return reject("entry"); }); };
var collectionMethod = function () { return new Promise(function (resolve, reject) { return reject("collection"); }); };
var edgeMethod = function () { return new Promise(function (resolve, reject) { return reject("edge"); }); };
var edge1 = function () {
    this.name = "entry";
    this.pluralName = "entries";
    this.relations = [];
    this.methods = [
        new ApiEdgeMethod_1.ApiEdgeMethod("entryMethod", entryMethod, ApiEdgeMethod_1.ApiEdgeMethodScope.Entry),
        new ApiEdgeMethod_1.ApiEdgeMethod("collectionMethod", collectionMethod, ApiEdgeMethod_1.ApiEdgeMethodScope.Collection),
        new ApiEdgeMethod_1.ApiEdgeMethod("method", edgeMethod, ApiEdgeMethod_1.ApiEdgeMethodScope.Edge)
    ];
};
var edge2 = function () {
    this.name = "relatedEntry";
    this.pluralName = "relatedEntries";
    this.relations = [];
    this.methods = [
        new ApiEdgeMethod_1.ApiEdgeMethod("relatedEntryMethod", relatedEntryMethod, ApiEdgeMethod_1.ApiEdgeMethodScope.Entry),
        new ApiEdgeMethod_1.ApiEdgeMethod("relatedCollectionMethod", collectionMethod, ApiEdgeMethod_1.ApiEdgeMethodScope.Collection),
        new ApiEdgeMethod_1.ApiEdgeMethod("relatedMethod", edgeMethod, ApiEdgeMethod_1.ApiEdgeMethodScope.Edge)
    ];
};
var edge3 = function () {
    this.name = "relatedCollectionEntry";
    this.pluralName = "relatedCollection";
    this.relations = [];
    this.methods = [
        new ApiEdgeMethod_1.ApiEdgeMethod("relatedEntryMethod", entryMethod, ApiEdgeMethod_1.ApiEdgeMethodScope.Entry),
        new ApiEdgeMethod_1.ApiEdgeMethod("relatedCollectionMethod", collectionMethod, ApiEdgeMethod_1.ApiEdgeMethodScope.Collection),
        new ApiEdgeMethod_1.ApiEdgeMethod("relatedMethod", edgeMethod, ApiEdgeMethod_1.ApiEdgeMethodScope.Edge)
    ];
};
var edge = new edge1;
var relatedEdge = new edge2;
var relatedCollectionEdge = new edge3;
var relation = new OneToOneRelation_1.OneToOneRelation(edge, relatedEdge);
var collectionRelation = new OneToManyRelation_1.OneToManyRelation(edge, relatedCollectionEdge);
var parser = new ApiRequestParser_1.ApiRequestPathParser(new Api_1.Api('1.0')
    .edge(edge)
    .edge(relatedEdge)
    .edge(relatedCollectionEdge)
    .relation(relation)
    .relation(collectionRelation));
tap.test('path should be empty when the input array is empty', function (t) {
    var path = parser.parse([]);
    t.equal(path.segments.length, 0);
    t.end();
});
tap.test('parser should not allow missing edges', function (t) {
    t.throws(function () { parser.parse(['test']); }, 'Missing Edge: test', 'should not allow missing start edge');
    t.throws(function () { parser.parse(['entries', '42', 'test']); }, 'Missing Edge: test', 'should not allow missing related field/method 1');
    t.throws(function () { parser.parse(['entries', '42', 'relatedField', 'test']); }, 'Missing Edge: test', 'should not allow missing related field/method 2');
    t.throws(function () { parser.parse(['entries', '42', 'relatedField', 'relatedCollection']); }, 'Missing Relation: relatedEntry -> relatedCollection', 'should not allow missing relation');
    t.throws(function () { parser.parse(['entries', '42', 'relatedCollection', '11', 'test']); }, 'Missing Relation: relatedCollection -> test', 'should not allow missing related relation');
    t.end();
});
tap.test('parser should not allow invalid methods', function (t) {
    t.throws(function () { parser.parse(['entries', '42', 'collectionMethod']); }, 'Missing Relation/Method: entries -> collectionMethod', 'should not allow collection method on entry segment');
    t.throws(function () { parser.parse(['entries', '42', 'relatedField', 'relatedCollectionMethod']); }, 'Missing Relation/Method: entries -> relatedCollectionMethod', 'should not allow collection method on a related entry segment');
    t.end();
});
tap.test('parser should parse single edge segment request', function (t) {
    var path = parser.parse(['entries']);
    t.equal(path.segments.length, 1, 'should have one segment');
    t.ok(path.segments[0] instanceof request.EdgePathSegment, 'should have an edge path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal(path.segments[0].relation, null, 'should have no relation');
    t.end();
});
tap.test('parser should parse single entry segment request', function (t) {
    var path = parser.parse(['entries', '42']);
    t.equal(path.segments.length, 1, 'should have one segment');
    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal(path.segments[0].id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');
    t.end();
});
tap.test('parser should parse single edge method segment request', function (t) {
    var path = parser.parse(['entries', 'method']);
    t.equal(path.segments.length, 1, 'should have one segment');
    t.ok(path.segments[0] instanceof request.MethodPathSegment, 'should have a method path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal(path.segments[0].method.execute, edgeMethod, 'should be the registered method');
    t.end();
});
tap.test('parser should parse single related entry segment request', function (t) {
    var path = parser.parse(['entries', '42', 'relatedEntry']);
    t.equal(path.segments.length, 2, 'should have two segments');
    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal(path.segments[0].id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');
    t.ok(path.segments[1] instanceof request.RelatedFieldPathSegment, 'should have a related field path segment');
    t.equal(path.segments[1].edge, edge, 'should be the registered edge');
    t.equal(path.segments[1].relation, relation, 'should be the registered relation');
    t.end();
});
tap.test('parser should parse single entry method segment request', function (t) {
    var path = parser.parse(['entries', '42', 'entryMethod']);
    t.equal(path.segments.length, 2, 'should have two segments');
    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal(path.segments[0].id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');
    t.ok(path.segments[1] instanceof request.MethodPathSegment, 'should have a method path segment');
    t.equal(path.segments[1].edge, edge, 'should be the registered edge');
    t.equal(path.segments[1].method.execute, entryMethod, 'should be the registered method');
    t.end();
});
tap.test('parser should parse single related entry method segment request', function (t) {
    var path = parser.parse(['entries', '42', 'relatedEntry', 'relatedEntryMethod']);
    t.equal(path.segments.length, 3, 'should have two segments');
    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal(path.segments[0].id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');
    t.ok(path.segments[1] instanceof request.RelatedFieldPathSegment, 'should have a related field path segment');
    t.equal(path.segments[1].edge, edge, 'should be the registered edge');
    t.equal(path.segments[1].relation, relation, 'should be the registered relation');
    t.ok(path.segments[2] instanceof request.MethodPathSegment, 'should have a method path segment');
    t.equal(path.segments[2].edge, relatedEdge, 'should be the registered edge');
    t.equal(path.segments[2].method.execute, relatedEntryMethod, 'should be the registered method');
    t.end();
});
tap.test('parser should parse single related collection segment request', function (t) {
    var path = parser.parse(['entries', '42', 'relatedCollection']);
    t.equal(path.segments.length, 2, 'should have two segments');
    t.ok(path.segments[0] instanceof request.EntryPathSegment, 'should have an entry path segment');
    t.equal(path.segments[0].edge, edge, 'should be the registered edge');
    t.equal(path.segments[0].id, '42', 'id should be the provided');
    t.equal(path.segments[0].relation, null, 'should have no relation');
    t.ok(path.segments[1] instanceof request.EdgePathSegment, 'should have an edge path segment');
    t.equal(path.segments[1].edge, relatedCollectionEdge, 'should be the registered edge');
    t.equal(path.segments[1].relation, collectionRelation, 'should be the registered relation');
    t.end();
});
tap.test('unsupported relation should cause error', function (t) {
    var unsupportedRelation = function () {
        this.name = "unsupported";
        this.from = edge;
        this.to = relatedEdge;
    };
    var badParser = new ApiRequestParser_1.ApiRequestPathParser(new Api_1.Api('1.0')
        .edge(edge)
        .edge(relatedEdge)
        .relation(new unsupportedRelation));
    t.throws(function () { badParser.parse(['entries', '42', 'unsupported']); }, 'Unsupported Relation');
    t.end();
});
tap.test('request parser should work too', function (t) {
    var requestParser = new ApiRequestParser_1.ApiRequestParser(new Api_1.Api('1.0'));
    var request = requestParser.parse([]);
    t.equal(request.path.segments.length, 0);
    t.end();
});
//# sourceMappingURL=request-parser.js.map