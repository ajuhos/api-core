import {ApiEdgeQueryContext} from "../src/edge/ApiEdgeQueryContext";
import {ApiEdgeQueryFilterType, ApiEdgeQueryFilter} from "../src/edge/ApiEdgeQueryFilter";
const tap = require('tap');

tap.test('constructing with id should work', (t: any) => {
    let context = new ApiEdgeQueryContext('test');
    t.equal(context.id, 'test');
    t.end()
});

tap.test('adding fields should work', (t: any) => {
    let context = new ApiEdgeQueryContext();
    context.field('test');
    t.same(context.fields, [ 'test' ]);
    context.field('test2');
    t.same(context.fields, [ 'test', 'test2' ]);
    t.end()
});

//TODO: Rewrite test with populatedRelations.
/*tap.test('adding populated fields should work', (t: any) => {
    let context = new ApiEdgeQueryContext();
    context.populate('test');
    t.same(context.populatedFields, [ 'test' ]);
    context.populate('test2');
    t.same(context.populatedFields, [ 'test', 'test2' ]);
    t.end()
});*/

tap.test('pagination should work', (t: any) => {
    let context = new ApiEdgeQueryContext();
    t.notOk(context.pagination);
    context.paginate(10, 20);
    t.equal(JSON.stringify(context.pagination), JSON.stringify({ skip: 10, limit: 20 }));
    t.end()
});

tap.test('sorting should work', (t: any) => {
    let context = new ApiEdgeQueryContext();
    context.sort('test', true);
    t.same(context.sortBy, [ [ 'test', 1 ] ]);
    context.sort('test2', false);
    t.same(context.sortBy, [ [ 'test', 1 ], [ 'test2', -1 ] ]);
    t.end()
});

tap.test('adding filters should work', (t: any) => {
    let context = new ApiEdgeQueryContext();

    context.filter('test', ApiEdgeQueryFilterType.Equals, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.Equals, 10) ]));
    context.filter('test2', ApiEdgeQueryFilterType.Equals, '20');
    t.equal(JSON.stringify(context.filters), JSON.stringify([
        new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.Equals, 10),
        new ApiEdgeQueryFilter('test2', ApiEdgeQueryFilterType.Equals, '20')
    ]));
    context.filters = [];

    context.filter('test', ApiEdgeQueryFilterType.NotEquals, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.NotEquals, 10) ]));
    context.filters = [];

    context.filter('test', ApiEdgeQueryFilterType.GreaterThan, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.GreaterThan, 10) ]));
    context.filters = [];

    context.filter('test', ApiEdgeQueryFilterType.LowerThan, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.LowerThan, 10) ]));
    context.filters = [];

    context.filter('test', ApiEdgeQueryFilterType.GreaterThanOrEquals, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.GreaterThanOrEquals, 10) ]));
    context.filters = [];

    context.filter('test', ApiEdgeQueryFilterType.LowerThanOrEquals, 10);
    t.equal(JSON.stringify(context.filters), JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.LowerThanOrEquals, 10) ]));
    context.filters = [];

    t.end()
});

tap.test('cloning should work', (t: any) => {
    let context = new ApiEdgeQueryContext('test');
    context.sort('test', true);
    context.filter('test', ApiEdgeQueryFilterType.NotEquals, 10);
    context.paginate(10, 20);
    context.field('test');

    let clonedContext = context.clone();
    t.equal(JSON.stringify(clonedContext), JSON.stringify(context));

    t.end()
});