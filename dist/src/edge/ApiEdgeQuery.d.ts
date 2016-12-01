import { ApiEdgeDefinition } from './ApiEdgeDefinition';
import { ApiEdgeQueryType } from './ApiEdgeQueryType';
import { ApiEdgeQueryContext } from "./ApiEdgeQueryContext";
import { ApiEdgeQueryResponse } from "./ApiEdgeQueryResponse";
export declare class ApiEdgeQuery {
    edge: ApiEdgeDefinition;
    type: ApiEdgeQueryType;
    context: ApiEdgeQueryContext;
    body: any;
    private originalFields;
    constructor(edge: ApiEdgeDefinition, type?: ApiEdgeQueryType, context?: ApiEdgeQueryContext, body?: any);
    private applySchemaOnInputItem;
    private applySchemaOnItem;
    private applyListSchema;
    private applyInputSchema;
    private applySchema;
    execute: () => Promise<ApiEdgeQueryResponse>;
}
