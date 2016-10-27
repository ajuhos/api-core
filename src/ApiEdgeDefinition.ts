import {ApiEdgeRelation} from "./relations/ApiEdgeRelation";
import {ApiEdgeQueryContext} from "./ApiEdgeQueryContext";

export interface ApiEdgeDefinition {

    name: string;
    methods: Object;
    relations: ApiEdgeRelation[];

    getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    updateEntries: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    removeEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    removeEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse[]>;
    exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    callMethod: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;

}