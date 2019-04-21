import {ApiEdgeRelation} from "../relations/ApiEdgeRelation";
import {ApiEdgeQueryContext} from "./ApiEdgeQueryContext";
import {ApiEdgeQueryResponse} from "./ApiEdgeQueryResponse";
import {ApiQueryScope} from "../query/ApiQuery";
import {ApiEdgeMethod, ApiEdgeMethodScope} from "./ApiEdgeMethod";
import {ApiRequestType} from "../request/ApiRequest";
import {ApiEdgeAction, ApiEdgeActionTrigger, ApiEdgeActionTriggerKind} from "./ApiEdgeAction";
import {ApiEdgeQueryType} from "./ApiEdgeQueryType";
import {ApiEdgeSchema} from "./ApiEdgeSchema";
import {SchemaTypeMapper} from "./utils/SchemaTypeMapper";
import {Api} from "../Api";
import {ApiEdgeQuery} from "./ApiEdgeQuery";

export interface ApiEdgeMetadata {
    name: string;
    pluralName: string;
    idField: string;
    fields: string[];
    methods: { name: string, type: ApiRequestType, parameters: string[] }[];
    typings?: { [key: string]: any };
    allowGet: boolean;
    allowList: boolean;
    allowCreate: boolean;
    allowUpdate: boolean;
    allowPatch: boolean;
    allowRemove: boolean;
    allowExists: boolean;
    external: boolean;
}

export interface ApiEdgeDefinition {
    name: string;
    pluralName: string;
    idField: string;

    api: Api;

    schema: ApiEdgeSchema;
    methods: ApiEdgeMethod[];
    relations: ApiEdgeRelation[];
    actions: ApiEdgeAction[];

    allowGet: boolean;
    allowList: boolean;
    allowCreate: boolean;
    allowUpdate: boolean;
    allowPatch: boolean;
    allowRemove: boolean;
    allowExists: boolean;
    external: boolean;

    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    patchEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;

    prepare: (api: Api) => Promise<void>;
    resolve: () => Promise<void>;
    metadata: () => ApiEdgeMetadata
    relation: (name: string) => Promise<ApiEdgeRelation|undefined>;

    get(key: string): any;
    set(key: string, value: any): any;
}

export abstract class ApiEdge implements ApiEdgeDefinition {
    name: string;
    pluralName: string;
    idField: string;

    api: Api;

    schema: ApiEdgeSchema;
    methods: ApiEdgeMethod[] = [];
    relations: ApiEdgeRelation[] = [];
    actions: ApiEdgeAction[] = [];

    allowGet: boolean = true;
    allowList: boolean = true;
    allowCreate: boolean = true;
    allowUpdate: boolean = true;
    allowPatch: boolean = true;
    allowRemove: boolean = true;
    allowExists: boolean = true;
    external: boolean = false;

    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    patchEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    prepare: (api: Api) => Promise<void>;

    resolve = () => Promise.resolve();

    metadata = () => {
        return {
            name: this.name,
            pluralName: this.pluralName,
            idField: this.idField,
            fields: this.schema.fields,
            methods: this.methods.map(m => ({
                name: m.name,
                type: m.acceptedTypes,
                scope: m.scope,
                parameters: m.parameters
            })),
            //relatedFields,
            typings: this.schema.originalSchema
                ? SchemaTypeMapper.exportSchema(this.schema.originalSchema)
                : undefined,
            allowGet: this.allowGet,
            allowList: this.allowList,
            allowCreate: this.allowCreate,
            allowUpdate: this.allowUpdate,
            allowPatch: this.allowPatch,
            allowRemove: this.allowRemove,
            allowExists: this.allowExists,
            external: this.external
        }
    };

    use = (action: ApiEdgeAction) => {
        this.actions.unshift(action);
        return this
    };

    action = (name: string,
              execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>,
              targetTypes: ApiEdgeQueryType = ApiEdgeQueryType.Any,
              triggerKind: ApiEdgeActionTriggerKind = ApiEdgeActionTriggerKind.BeforeEvent,
              triggers: ApiEdgeActionTrigger = ApiEdgeActionTrigger.Any,
              triggerNames: string[] = []): ApiEdge => {
        this.actions.unshift(new ApiEdgeAction(name, execute, targetTypes, triggerKind, triggers, triggerNames));
        return this
    };

    relation = (name: string) => this.api.findRelationOfEdge(this.pluralName, name);

    edgeMethod(name: string,
               execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
               acceptedTypes?: ApiRequestType,
               requiresData?: boolean): ApiEdge;
    edgeMethod(name: string,
               execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
               acceptedTypes?: ApiRequestType,
               parameters?: string[],
               requiresData?: boolean): ApiEdge;
    edgeMethod(name: string,
               execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
               acceptedTypes: ApiRequestType = ApiRequestType.Any,
               parametersOrData: string[]|boolean = [],
               requiresData = true): ApiEdge {
        if(this.methods.find((method: ApiEdgeMethod) =>
            method.name === name))
           throw "A method with the same name already exists.";

        this.methods.push(new ApiEdgeMethod(name, execute, ApiEdgeMethodScope.Edge, acceptedTypes, parametersOrData, requiresData));
        return this
    };

    collectionMethod(name: string,
                     execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                     acceptedTypes?: ApiRequestType,
                     requiresData?: boolean): ApiEdge;
    collectionMethod(name: string,
                     execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                     acceptedTypes?: ApiRequestType,
                     parameters?: string[],
                     requiresData?: boolean): ApiEdge;
    collectionMethod(name: string,
                     execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                     acceptedTypes: ApiRequestType = ApiRequestType.Any,
                     parametersOrData: string[]|boolean = [],
                     requiresData = true): ApiEdge {
        if(this.methods.find((method: ApiEdgeMethod) =>
            method.name === name &&
            (method.scope == ApiEdgeMethodScope.Collection || method.scope == ApiEdgeMethodScope.Edge)))
            throw "A collection method with the same name already exists.";

        this.methods.push(new ApiEdgeMethod(name, execute, ApiEdgeMethodScope.Collection, acceptedTypes, parametersOrData, requiresData));
        return this
    };

    entryMethod(name: string,
                execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                acceptedTypes?: ApiRequestType,
                requiresData?: boolean): ApiEdge;
    entryMethod(name: string,
                execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                acceptedTypes?: ApiRequestType,
                parameters?: string[],
                requiresData?: boolean): ApiEdge;
    entryMethod(name: string,
                execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                acceptedTypes: ApiRequestType = ApiRequestType.Any,
                parametersOrData: string[]|boolean = [],
                requiresData = true): ApiEdge {
        if(this.methods.find((method: ApiEdgeMethod) =>
            method.name === name &&
            (method.scope == ApiEdgeMethodScope.Entry || method.scope == ApiEdgeMethodScope.Edge)))
            throw "An entry method with the same name already exists.";

        this.methods.push(new ApiEdgeMethod(name, execute, ApiEdgeMethodScope.Entry, acceptedTypes, parametersOrData, requiresData));
        return this
    };

    private extension: { [key: string]: any } = {};
    get = (key: string) => this.extension[key];
    set = (key: string, value: any) => this.extension[key] = value;

    buildQuery(type: ApiEdgeQueryType = ApiEdgeQueryType.Get, body: any = null) {
        return new ApiEdgeQuery(this, type, new ApiEdgeQueryContext(), body)
    }
}