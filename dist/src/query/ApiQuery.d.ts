import { ApiEdgeQueryContext } from "../edge/ApiEdgeQueryContext";
import { ApiEdgeQueryResponse } from "../edge/ApiEdgeQueryResponse";
export interface ApiQueryScope {
    context: ApiEdgeQueryContext;
    body: any | null;
    response: ApiEdgeQueryResponse | null;
}
export interface QueryStep {
    execute(scope: ApiQueryScope): Promise<ApiQueryScope>;
}
export declare class ApiQuery {
    steps: QueryStep[];
    unshift: (step: QueryStep) => ApiQuery;
    execute: () => Promise<ApiEdgeQueryResponse>;
}
