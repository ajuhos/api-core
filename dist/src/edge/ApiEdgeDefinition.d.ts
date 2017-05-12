import { ApiEdgeRelation } from "../relations/ApiEdgeRelation";
import { ApiEdgeQueryContext } from "./ApiEdgeQueryContext";
import { ApiEdgeQueryResponse } from "./ApiEdgeQueryResponse";
import { ApiQueryScope } from "../query/ApiQuery";
import { ApiEdgeMethod } from "./ApiEdgeMethod";
import { ApiRequestType } from "../request/ApiRequest";
import { ApiEdgeAction, ApiEdgeActionTriggerKind, ApiEdgeActionTrigger } from "./ApiEdgeAction";
import { ApiEdgeQueryType } from "./ApiEdgeQueryType";
import { ApiEdgeSchema } from "./ApiEdgeSchema";
export interface ApiEdgeDefinition {
    name: string;
    pluralName: string;
    idField: string;
    schema: ApiEdgeSchema;
    methods: ApiEdgeMethod[];
    relations: ApiEdgeRelation[];
    actions: ApiEdgeAction[];
    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    patchEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
}
export declare abstract class ApiEdge implements ApiEdgeDefinition {
    name: string;
    pluralName: string;
    idField: string;
    schema: ApiEdgeSchema;
    methods: ApiEdgeMethod[];
    relations: ApiEdgeRelation[];
    actions: ApiEdgeAction[];
    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    patchEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    use: (action: ApiEdgeAction) => this;
    action: (name: string, execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>, targetTypes?: ApiEdgeQueryType, triggerKind?: ApiEdgeActionTriggerKind, triggers?: ApiEdgeActionTrigger, triggerNames?: string[]) => ApiEdge;
    edgeMethod: (name: string, execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>, acceptedTypes?: ApiRequestType) => ApiEdge;
    collectionMethod: (name: string, execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>, acceptedTypes?: ApiRequestType) => ApiEdge;
    entryMethod: (name: string, execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>, acceptedTypes?: ApiRequestType) => ApiEdge;
}
