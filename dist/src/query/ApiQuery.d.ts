import { ApiEdgeQueryContext } from "../edge/ApiEdgeQueryContext";
import { ApiEdgeQueryResponse } from "../edge/ApiEdgeQueryResponse";
import { ApiRequest } from "../request/ApiRequest";
export interface ApiQueryScope {
    context: ApiEdgeQueryContext;
    body: any | null;
    identity: any | null;
    response: ApiEdgeQueryResponse | null;
    query: ApiQuery;
    request: ApiRequest;
    step: number;
}
export interface QueryStep {
    execute(scope: ApiQueryScope): Promise<ApiQueryScope>;
}
export declare class ApiQuery {
    request: ApiRequest;
    steps: QueryStep[];
    unshift: (step: QueryStep) => ApiQuery;
    execute: (identity?: any) => Promise<ApiEdgeQueryResponse>;
}
