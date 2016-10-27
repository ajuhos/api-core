import { ApiEdgeDefinition } from './ApiEdgeDefinition';
import { ApiEdgeQueryType } from './ApiEdgeQueryType';
import { ApiEdgeQueryContext } from "./ApiEdgeQueryContext";
export declare class ApiEdgeQuery {
    edge: ApiEdgeDefinition;
    type: ApiEdgeQueryType;
    context: ApiEdgeQueryContext;
    body: any;
    constructor(edge: ApiEdgeDefinition, type?: ApiEdgeQueryType, context?: ApiEdgeQueryContext, body?: any);
    execute: () => any;
}
