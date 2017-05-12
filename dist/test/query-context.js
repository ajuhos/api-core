"use strict";
var ApiEdgeQueryContext_1 = require("../src/edge/ApiEdgeQueryContext");
var ApiEdgeQueryFilter_1 = require("../src/edge/ApiEdgeQueryFilter");
var tap = require('tap');
tap.test('constructing with id should work', function (t) {
    var context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext('test');
    t.equal(context.id, 'test');
    t.end();
});
tap.test('adding fields should work', function (t) {
    var context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext();
    context.field('test');
    t.same(context.fields, ['test']);
    context.field('test2');
    t.same(context.fields, ['test', 'test2']);
    t.end();
});
tap.test('pagination should work', function (t) {
    var context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext();
    t.notOk(context.pagination);
    context.paginate(10, 20);
    t.equal(JSON.stringify(context.pagination), JSON.stringify({ skip: 10, limit: 20 }));
    t.end();
});
tap.test('sorting should work', function (t) {
    var context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext();
    context.sort('test', true);
    t.same(context.sortBy, [['test', 1]]);
    context.sort('test2', false);
    t.same(context.sortBy, [['test', 1], ['test2', -1]]);
    t.end();
});
tap.test('adding filters should work', function (t) {
    var context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext();
    context.filter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.Equals, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([new ApiEdgeQueryFilter_1.ApiEdgeQueryFilter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.Equals, 10)]));
    context.filter('test2', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.Equals, '20');
    t.equal(JSON.stringify(context.filters), JSON.stringify([
        new ApiEdgeQueryFilter_1.ApiEdgeQueryFilter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.Equals, 10),
        new ApiEdgeQueryFilter_1.ApiEdgeQueryFilter('test2', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.Equals, '20')
    ]));
    context.filters = [];
    context.filter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.NotEquals, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([new ApiEdgeQueryFilter_1.ApiEdgeQueryFilter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.NotEquals, 10)]));
    context.filters = [];
    context.filter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.GreaterThan, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([new ApiEdgeQueryFilter_1.ApiEdgeQueryFilter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.GreaterThan, 10)]));
    context.filters = [];
    context.filter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.LowerThan, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([new ApiEdgeQueryFilter_1.ApiEdgeQueryFilter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.LowerThan, 10)]));
    context.filters = [];
    context.filter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.GreaterThanOrEquals, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([new ApiEdgeQueryFilter_1.ApiEdgeQueryFilter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.GreaterThanOrEquals, 10)]));
    context.filters = [];
    context.filter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.LowerThanOrEquals, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([new ApiEdgeQueryFilter_1.ApiEdgeQueryFilter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.LowerThanOrEquals, 10)]));
    context.filters = [];
    t.end();
});
tap.test('cloning should work', function (t) {
    var context = new ApiEdgeQueryContext_1.ApiEdgeQueryContext('test');
    context.sort('test', true);
    context.filter('test', ApiEdgeQueryFilter_1.ApiEdgeQueryFilterType.NotEquals, 10);
    context.paginate(10, 20);
    context.field('test');
    var clonedContext = context.clone();
    t.equal(JSON.stringify(clonedContext), JSON.stringify(context));
    t.end();
});
//# sourceMappingURL=query-context.js.map