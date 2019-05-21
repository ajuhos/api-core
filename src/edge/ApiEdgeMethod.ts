import {ApiQueryScope} from "../query/ApiQuery";
import {ApiRequestType} from "../request/ApiRequest";
import {ApiEdgeQueryResponse} from "./ApiEdgeQueryResponse";
import {ApiEdgeError} from "../query/ApiEdgeError";

export enum ApiEdgeMethodScope {

    /**
     * Available for both entries and collections.
     */
    Edge = 1,

    /**
     * Available for single entries.
     */
    Entry = 2,

    /**
     * Available for collections.
     */
    Collection = 3

}

export enum ApiEdgeMethodOutput {

    Entry = 1,

    List = 2

}

export type ApiEdgeMethodOptions = {
    name: string;
    requiresData?: boolean;
    acceptedTypes?: ApiRequestType;
    scope?: ApiEdgeMethodScope;
    output?: ApiEdgeMethodOutput;
    execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>;
    parameters?: string[];
}

export class ApiEdgeMethod {
    name: string;
    requiresData: boolean;
    acceptedTypes: ApiRequestType = ApiRequestType.Any;
    scope: ApiEdgeMethodScope = ApiEdgeMethodScope.Edge;
    output: ApiEdgeMethodOutput = ApiEdgeMethodOutput.Entry;
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
    constructor(options: ApiEdgeMethodOptions);
    constructor(nameOrOptions: string|ApiEdgeMethodOptions,
                execute?: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                scope: ApiEdgeMethodScope = ApiEdgeMethodScope.Edge,
                acceptedTypes: ApiRequestType = ApiRequestType.Any,
                parametersOrData: string[]|boolean = [],
                requiresData = true) {

        if(typeof nameOrOptions === 'object') {
            this.name = nameOrOptions.name;
            this.requiresData = typeof nameOrOptions.requiresData === 'boolean' ? nameOrOptions.requiresData : true;
            this.acceptedTypes = nameOrOptions.acceptedTypes || ApiRequestType.Any;
            this.scope = nameOrOptions.scope || ApiEdgeMethodScope.Edge;
            this.output = nameOrOptions.output || ApiEdgeMethodOutput.Entry;
            this.execute = nameOrOptions.execute;
            this.parameters = nameOrOptions.parameters || []
        }
        else {
            let parameters: string[] = [];
            if (typeof parametersOrData === 'boolean') requiresData = parametersOrData;
            else parameters = parametersOrData;

            this.name = nameOrOptions;
            this.scope = scope;
            this.execute = execute || (() => Promise.reject(new ApiEdgeError(400, 'Not Implemented')));
            this.acceptedTypes = acceptedTypes;
            this.requiresData = requiresData;
            this.parameters = parameters;
        }
    }
}