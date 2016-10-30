import { QueryStep, ApiQueryScope } from "../query/ApiQuery";
export declare enum ApiEdgeMethodScope {
    Edge = 0,
    Entry = 1,
    Collection = 2,
}
export declare class ApiEdgeMethod implements QueryStep {
    name: string;
    scope: ApiEdgeMethodScope;
    execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>;
    constructor(name: string, execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>, scope?: ApiEdgeMethodScope);
}
