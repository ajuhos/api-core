import { QueryStep, ApiQueryScope } from "../query/ApiQuery";
import { ApiRequestType } from "../request/ApiRequest";
export declare enum ApiEdgeMethodScope {
    Edge = 0,
    Entry = 1,
    Collection = 2,
}
export declare class ApiEdgeMethod implements QueryStep {
    name: string;
    acceptedTypes: ApiRequestType;
    scope: ApiEdgeMethodScope;
    execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>;
    constructor(name: string, execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>, scope?: ApiEdgeMethodScope, acceptedTypes?: ApiRequestType);
}
