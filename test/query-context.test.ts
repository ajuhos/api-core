import {ApiEdgeQueryContext} from "../src/edge/ApiEdgeQueryContext";
import {ApiEdgeQueryFilterType, ApiEdgeQueryFilter} from "../src/edge/ApiEdgeQueryFilter";

test('constructing with id should work', () => {
    let context = new ApiEdgeQueryContext('test');
    expect(context.id).toBe('test');
});

test('adding fields should work', () => {
    let context = new ApiEdgeQueryContext();
    context.field('test');
    expect(context.fields).toStrictEqual([ 'test' ]);
    context.field('test2');
    expect(context.fields).toStrictEqual([ 'test', 'test2' ]);
});

//TODO: Rewrite test with populatedRelations.
/*
test('adding populated fields should work', () => {
    //let context = new ApiEdgeQueryContext();
    //context.populate('test');
    //expect(context.populatedFields).toStrictEqual([ 'test' ]);
    //context.populate('test2');
    //expect(context.populatedFields).toStrictEqual([ 'test', 'test2' ]);
});
*/

test('pagination should work', () => {
    let context = new ApiEdgeQueryContext();
    expect(context.pagination).toBeUndefined();
    context.paginate(10, 20);
    expect(JSON.stringify(context.pagination)).toBe(JSON.stringify({ skip: 10, limit: 20 }));
});

test('sorting should work', () => {
    let context = new ApiEdgeQueryContext();
    context.sort('test', true);
    expect(context.sortBy).toStrictEqual([ [ 'test', 1 ] ]);
    context.sort('test2', false);
    expect(context.sortBy).toStrictEqual([ [ 'test', 1 ], [ 'test2', -1 ] ]);
});

test('adding filters should work', () => {
    let context = new ApiEdgeQueryContext();

    context.filter('test', ApiEdgeQueryFilterType.Equals, 10);
    expect(JSON.stringify(context.filters)).toBe(JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.Equals, 10) ]));
    
    context.filter('test2', ApiEdgeQueryFilterType.Equals, '20');
    expect(JSON.stringify(context.filters))
        .toBe(JSON.stringify(
            [ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.Equals, 10),
              new ApiEdgeQueryFilter('test2', ApiEdgeQueryFilterType.Equals, '20')
            ]
        ));
    context.filters = [];

    context.filter('test', ApiEdgeQueryFilterType.NotEquals, 10);
    expect(JSON.stringify(context.filters)).toBe(JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.NotEquals, 10) ]));
    context.filters = [];

    context.filter('test', ApiEdgeQueryFilterType.GreaterThan, 10);
    expect(JSON.stringify(context.filters)).toBe(JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.GreaterThan, 10) ]));
    context.filters = [];

    context.filter('test', ApiEdgeQueryFilterType.LowerThan, 10);
    expect(JSON.stringify(context.filters)).toBe(JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.LowerThan, 10) ]));
    context.filters = [];

    context.filter('test', ApiEdgeQueryFilterType.GreaterThanOrEquals, 10);
    expect(JSON.stringify(context.filters)).toBe(JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.GreaterThanOrEquals, 10) ]));
    context.filters = [];

    context.filter('test', ApiEdgeQueryFilterType.LowerThanOrEquals, 10);
    expect(JSON.stringify(context.filters)).toBe(JSON.stringify([ new ApiEdgeQueryFilter('test', ApiEdgeQueryFilterType.LowerThanOrEquals, 10) ]));
    context.filters = [];
});

test('cloning should work', () => {
    let context = new ApiEdgeQueryContext('test');
    context.sort('test', true);
    context.filter('test', ApiEdgeQueryFilterType.NotEquals, 10);
    context.paginate(10, 20);
    context.field('test');

    let clonedContext = context.clone();
    expect(JSON.stringify(clonedContext)).toBe(JSON.stringify(context));
});
