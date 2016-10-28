import { QueryStep, QueryScope, ApiQuery } from "./ApiQuery";
import { ApiEdgeQuery } from "../edge/ApiEdgeQuery";
import { ApiEdgeQueryContext } from "../edge/ApiEdgeQueryContext";
import { ApiEdgeRelation } from "../relations/ApiEdgeRelation";
import { ApiRequest } from "../request/ApiRequest";
import { ApiEdgeQueryResponse } from "../edge/ApiEdgeQueryResponse";
import { Api } from "../Api";
export declare class QueryEdgeQueryStep implements QueryStep {
    query: ApiEdgeQuery;
    constructor(query: ApiEdgeQuery);
    execute: (scope: QueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class RelateQueryStep implements QueryStep {
    relation: ApiEdgeRelation;
    constructor(relation: ApiEdgeRelation);
    execute: (scope: QueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class SetResponseQueryStep implements QueryStep {
    response: ApiEdgeQueryResponse;
    constructor(response: ApiEdgeQueryResponse);
    execute: (scope: QueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class SetBodyQueryStep implements QueryStep {
    body: any;
    constructor(body: any);
    execute: (scope: QueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class ProvideIdQueryStep implements QueryStep {
    fieldName: string;
    constructor(fieldName?: string);
    execute: (scope: QueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class ExtendContextQueryStep implements QueryStep {
    context: ApiEdgeQueryContext;
    constructor(context: ApiEdgeQueryContext);
    execute: (scope: QueryScope) => Promise<{}>;
    inspect: () => string;
}
export declare class ApiQueryBuilder {
    api: Api;
    constructor(api: Api);
    private buildProvideIdStep(query, currentSegment);
    private buildCheckStep(query, currentSegment);
    private buildReadStep(query, currentSegment);
    private buildReadQuery;
    private buildChangeQuery;
    private buildCreateQuery;
    build: (request: ApiRequest) => ApiQuery;
}
