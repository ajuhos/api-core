import { ApiEdgeRelation } from "../relations/ApiEdgeRelation";
import { ApiEdgeQueryContext } from "./ApiEdgeQueryContext";
import { ApiEdgeQueryResponse } from "./ApiEdgeQueryResponse";
export interface ApiEdgeDefinition {
    name: string;
    pluralName: string;
    idField: string;
    fields: string[];
    methods: Object;
    relations: ApiEdgeRelation[];
    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    patchEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntries: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse[]>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    callMethod: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
}
