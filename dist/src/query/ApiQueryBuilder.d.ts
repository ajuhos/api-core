import { QueryStep, ApiQueryScope, ApiQuery } from "./ApiQuery";
import { ApiEdgeQuery } from "../edge/ApiEdgeQuery";
import { ApiEdgeQueryContext } from "../edge/ApiEdgeQueryContext";
import { ApiEdgeRelation } from "../relations/ApiEdgeRelation";
import { ApiRequest } from "../request/ApiRequest";
import { ApiEdgeQueryResponse } from "../edge/ApiEdgeQueryResponse";
import { Api } from "../Api";
import { ApiEdgeMethod } from "../edge/ApiEdgeMethod";
export declare class QueryEdgeQueryStep implements QueryStep {
    query: ApiEdgeQuery;
    constructor(query: ApiEdgeQuery);
    execute: (scope: ApiQueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class CallMethodQueryStep implements QueryStep {
    method: ApiEdgeMethod;
    constructor(method: ApiEdgeMethod);
    execute: (scope: ApiQueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class RelateQueryStep implements QueryStep {
    relation: ApiEdgeRelation;
    constructor(relation: ApiEdgeRelation);
    execute: (scope: ApiQueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class SetResponseQueryStep implements QueryStep {
    response: ApiEdgeQueryResponse;
    constructor(response: ApiEdgeQueryResponse);
    execute: (scope: ApiQueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class SetBodyQueryStep implements QueryStep {
    body: any;
    constructor(body: any);
    execute: (scope: ApiQueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class ProvideIdQueryStep implements QueryStep {
    fieldName: string;
    constructor(fieldName?: string);
    execute: (scope: ApiQueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class ExtendContextQueryStep implements QueryStep {
    context: ApiEdgeQueryContext;
    constructor(context: ApiEdgeQueryContext);
    execute: (scope: ApiQueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class ApiQueryBuilder {
    api: Api;
    constructor(api: Api);
    private static addMethodCallStep(request, query, method);
    private static buildProvideIdStep(query, currentSegment);
    private static buildCheckStep(query, currentSegment);
    private static buildReadStep(query, currentSegment);
    private buildReadQuery;
    private buildChangeQuery;
    private buildCreateQuery;
    build: (request: ApiRequest) => ApiQuery;
}
