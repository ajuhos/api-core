export declare enum ApiEdgeQueryFilterType {
    Equals = 0,
    GreaterThanOrEquals = 1,
    GreaterThan = 2,
    LowerThanOrEquals = 3,
    LowerThan = 4,
    NotEquals = 5,
    Similar = 6,
    In = 7,
}
export declare class ApiEdgeQueryFilter {
    field: string;
    value: any;
    type: ApiEdgeQueryFilterType;
    constructor(field: string, type: ApiEdgeQueryFilterType, value: any);
    clone: () => ApiEdgeQueryFilter;
}
