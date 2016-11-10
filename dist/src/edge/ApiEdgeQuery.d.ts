import { ApiEdgeDefinition } from './ApiEdgeDefinition';
import { ApiEdgeQueryType } from './ApiEdgeQueryType';
import { ApiEdgeQueryContext } from "./ApiEdgeQueryContext";
import { ApiEdgeQueryResponse } from "./ApiEdgeQueryResponse";
export declare class ApiEdgeQuery {
    edge: ApiEdgeDefinition;
    type: ApiEdgeQueryType;
    context: ApiEdgeQueryContext;
    body: any;
    constructor(edge: ApiEdgeDefinition, type?: ApiEdgeQueryType, context?: ApiEdgeQueryContext, body?: any);
    private applySchemaOnItem;
    private applyListSchema;
    private applySchema;
    execute: () => Promise<ApiEdgeQueryResponse>;
}
