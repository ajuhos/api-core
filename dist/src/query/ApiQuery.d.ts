import { ApiEdgeQueryContext } from "../edge/ApiEdgeQueryContext";
import { ApiEdgeQueryResponse } from "../edge/ApiEdgeQueryResponse";
export interface QueryScope {
    context: ApiEdgeQueryContext;
    body: any | null;
    response: ApiEdgeQueryResponse | null;
}
export interface QueryStep {
    execute(scope: QueryScope): Promise<QueryScope>;
}
export declare class ApiQuery {
    steps: QueryStep[];
    unshift: (step: QueryStep) => ApiQuery;
    push: (step: QueryStep) => ApiQuery;
    execute: () => Promise<ApiEdgeQueryResponse>;
}
