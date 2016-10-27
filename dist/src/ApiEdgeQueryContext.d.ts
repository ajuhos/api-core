import { ApiEdgeQueryFilter, ApiEdgeQueryFilterType } from "./ApiEdgeQueryFilter";
export declare class ApiEdgeQueryContext {
    id: string;
    fields: string[];
    populatedFields: string[];
    pagination: {
        skip: number;
        limit: number;
    };
    filters: ApiEdgeQueryFilter[];
    clone: () => ApiEdgeQueryContext;
    constructor(id?: string, fields?: string[]);
    paginate: (skip: any, limit: any) => this;
    populate(field: string): this;
    field(field: string): this;
    filter(field: string, type: ApiEdgeQueryFilterType, value: any): this;
}
