import { ApiEdgeRelation } from "../relations/ApiEdgeRelation";
import { ApiEdgeQueryContext } from "./ApiEdgeQueryContext";
import { ApiEdgeQueryResponse } from "./ApiEdgeQueryResponse";
import { ApiQueryScope } from "../query/ApiQuery";
import { ApiEdgeMethod } from "./ApiEdgeMethod";
import { ApiRequestType } from "../request/ApiRequest";
export interface ApiEdgeDefinition {
    name: string;
    pluralName: string;
    idField: string;
    fields: string[];
    methods: ApiEdgeMethod[];
    relations: ApiEdgeRelation[];
    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    patchEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    callMethod: (scope: ApiQueryScope) => Promise<ApiQueryScope>;
}
export declare abstract class ApiEdge implements ApiEdgeDefinition {
    name: string;
    pluralName: string;
    idField: string;
    fields: string[];
    methods: ApiEdgeMethod[];
    relations: ApiEdgeRelation[];
    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    patchEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    callMethod: (scope: ApiQueryScope) => Promise<ApiQueryScope>;
    edgeMethod: (name: string, execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>, acceptedTypes?: ApiRequestType) => ApiEdge;
    collectionMethod: (name: string, execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>, acceptedTypes?: ApiRequestType) => ApiEdge;
    entryMethod: (name: string, execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>, acceptedTypes?: ApiRequestType) => ApiEdge;
}
