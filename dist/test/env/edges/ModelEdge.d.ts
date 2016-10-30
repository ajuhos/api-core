import { ApiEdge } from "../../../src/edge/ApiEdgeDefinition";
import { ApiEdgeQueryContext } from "../../../src/edge/ApiEdgeQueryContext";
import { ApiEdgeQueryResponse } from "../../../src/edge/ApiEdgeQueryResponse";
export declare class Model {
    id: string;
    constructor(obj: any);
}
export declare class ModelEdge<ModelType extends Model> extends ApiEdge {
    name: string;
    pluralName: string;
    idField: string;
    fields: never[];
    provider: ModelType[];
    protected createModel: (obj: any) => ModelType;
    methods: never[];
    relations: never[];
    inspect: () => string;
    private applyMapping(item, fields);
    private static applyFilter(item, filter);
    private applyFilters(item, filters);
    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, body: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, body: any) => Promise<ApiEdgeQueryResponse>;
    patchEntry: (context: ApiEdgeQueryContext, body: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
}
