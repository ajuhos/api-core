import { ApiQueryScope } from "../query/ApiQuery";
import { ApiRequestType } from "../request/ApiRequest";
import { ApiEdgeQueryResponse } from "./ApiEdgeQueryResponse";
export declare enum ApiEdgeMethodScope {
    Edge = 0,
    Entry = 1,
    Collection = 2,
}
export declare class ApiEdgeMethod {
    name: string;
    requiresData: boolean;
    acceptedTypes: ApiRequestType;
    scope: ApiEdgeMethodScope;
    execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>;
    constructor(name: string, execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>, scope?: ApiEdgeMethodScope, acceptedTypes?: ApiRequestType, requiresData?: boolean);
}
