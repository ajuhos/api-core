import {ApiEdgeRelation} from "../relations/ApiEdgeRelation";
import {ApiEdgeQueryContext} from "./ApiEdgeQueryContext";
import {ApiEdgeQueryResponse} from "./ApiEdgeQueryResponse";
import {ApiQueryScope} from "../query/ApiQuery";
import {ApiEdgeMethod, ApiEdgeMethodScope} from "./ApiEdgeMethod";
import {ApiRequestType} from "../request/ApiRequest";
import {ApiEdgeAction, ApiEdgeActionTriggerKind, ApiEdgeActionTrigger} from "./ApiEdgeAction";
import {ApiEdgeQueryType} from "./ApiEdgeQueryType";
import {ApiEdgeSchema} from "./ApiEdgeSchema";
import {SchemaTypeMapper} from "./utils/SchemaTypeMapper";

export interface ApiEdgeMetadata {
    name: string;
    pluralName: string;
    idField: string;
    fields: string[];
    methods: string[];
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
    metadata: () => ApiEdgeMetadata
}

export abstract class ApiEdge implements ApiEdgeDefinition {
    name: string;
    pluralName: string;
    idField: string;

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

    metadata = () => {
        return {
            name: this.name,
            pluralName: this.pluralName,
            idField: this.idField,
            fields: this.schema.fields,
            methods: this.methods.map(m => m.name),
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

    edgeMethod = (name: string,
                  execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                  acceptedTypes: ApiRequestType = ApiRequestType.Any,
                  requiresData = true): ApiEdge => {
        if(this.methods.find((method: ApiEdgeMethod) =>
            method.name === name))
           throw "A method with the same name already exists.";

        this.methods.push(new ApiEdgeMethod(name, execute, ApiEdgeMethodScope.Edge, acceptedTypes, requiresData));
        return this
    };

    collectionMethod = (name: string,
                        execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                        acceptedTypes: ApiRequestType = ApiRequestType.Any,
                        requiresData = true): ApiEdge => {
        if(this.methods.find((method: ApiEdgeMethod) =>
            method.name === name &&
            (method.scope == ApiEdgeMethodScope.Collection || method.scope == ApiEdgeMethodScope.Edge)))
            throw "A collection method with the same name already exists.";

        this.methods.push(new ApiEdgeMethod(name, execute, ApiEdgeMethodScope.Collection, acceptedTypes, requiresData));
        return this
    };

    entryMethod = (name: string,
                   execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                   acceptedTypes: ApiRequestType = ApiRequestType.Any,
                   requiresData = true): ApiEdge => {
        if(this.methods.find((method: ApiEdgeMethod) =>
            method.name === name &&
            (method.scope == ApiEdgeMethodScope.Entry || method.scope == ApiEdgeMethodScope.Edge)))
            throw "An entry method with the same name already exists.";

        this.methods.push(new ApiEdgeMethod(name, execute, ApiEdgeMethodScope.Entry, acceptedTypes, requiresData));
        return this
    };
}