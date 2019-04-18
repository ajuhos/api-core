import {QueryStep, ApiQueryScope} from "../query/ApiQuery";
import {ApiRequestType} from "../request/ApiRequest";
import {ApiEdgeQueryResponse} from "./ApiEdgeQueryResponse";

export enum ApiEdgeMethodScope {

    /**
     * Available for both entries and collections.
     */
    Edge,

    /**
     * Available for single entries.
     */
    Entry,

    /**
     * Available for collections.
     */
    Collection

}

export class ApiEdgeMethod {
    name: string;
    requiresData: boolean;
    acceptedTypes: ApiRequestType = ApiRequestType.Any;
    scope: ApiEdgeMethodScope = ApiEdgeMethodScope.Edge;
    execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>;
    parameters: string[];

    constructor(name: string,
                execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                scope?: ApiEdgeMethodScope,
                acceptedTypes?: ApiRequestType,
                requiresData?: boolean);
    constructor(name: string,
                execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                scope?: ApiEdgeMethodScope,
                acceptedTypes?: ApiRequestType,
                parameters?: string[],
                requiresData?: boolean);
    constructor(name: string,
                execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                scope: ApiEdgeMethodScope,
                acceptedTypes: ApiRequestType,
                parametersOrData: string[]|boolean,
                requiresData: boolean);
    constructor(name: string,
                execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                scope: ApiEdgeMethodScope = ApiEdgeMethodScope.Edge,
                acceptedTypes: ApiRequestType = ApiRequestType.Any,
                parametersOrData: string[]|boolean = [],
                requiresData = true) {
        let parameters: string[] = [];
        if(typeof parametersOrData === 'boolean') requiresData = parametersOrData;
        else parameters = parametersOrData;

        this.name = name;
        this.scope = scope;
        this.execute = execute;
        this.acceptedTypes = acceptedTypes;
        this.requiresData = requiresData;
        this.parameters = parameters;
    }
}