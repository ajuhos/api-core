export enum ApiEdgeQueryFilterType {
    Equals = 1,
    GreaterThanOrEquals,
    GreaterThan,
    LowerThanOrEquals,
    LowerThan,
    NotEquals,
    Similar,
    In
}

export interface ExportedApiEdgeQueryFilter {
    field: string
    value: any
    type: ApiEdgeQueryFilterType
}

export class ApiEdgeQueryFilter {
    field: string;
    value: any;
    type: ApiEdgeQueryFilterType;

    constructor(field: string, type: ApiEdgeQueryFilterType, value: any) {
        this.field = field;
        this.value = value;
        this.type = type;
    }

    clone = () => new ApiEdgeQueryFilter(this.field, this.type, this.value);
}