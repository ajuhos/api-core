import { ApiEdgeQueryFilter, ApiEdgeQueryFilterType } from "./ApiEdgeQueryFilter";
export declare class ApiEdgeQueryContext {
    id: string | null;
    fields: string[];
    populatedFields: string[];
    pagination: {
        skip: number;
        limit: number;
    };
    sortBy: any[];
    filters: ApiEdgeQueryFilter[];
    clone: () => ApiEdgeQueryContext;
    constructor(id?: string | null, fields?: string[]);
    paginate: (skip: number, limit: number) => this;
    sort: (fieldName: string, ascending?: boolean) => this;
    populate(field: string): this;
    field(field: string): this;
    filter(field: string, type: ApiEdgeQueryFilterType, value: any): this;
}
