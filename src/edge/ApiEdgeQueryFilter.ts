export enum ApiEdgeQueryFilterType {
    Equals,
    GreaterThanOrEquals,
    GreaterThan,
    LowerThanOrEquals,
    LowerThan,
    NotEquals,
    Similar
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