import {ApiEdgeQueryContext} from "./ApiEdgeQueryContext";
import {ApiEdgeQueryResponse} from "./ApiEdgeQueryResponse";
import {ApiEdgeSchema} from "./ApiEdgeSchema";
import {ApiEdge, ApiEdgeDefinition} from "./ApiEdgeDefinition";
import {SchemaTypeMapper} from "./utils/SchemaTypeMapper";
import {ApiEdgeMethod} from "./ApiEdgeMethod";
import {ApiQueryScope} from "../query/ApiQuery";
import {Api} from "../Api";

export abstract class ExternalApiProvider {
    protected metadata: any;
    protected api: Api;

    protected constructor(metadata: any, api: Api) {
        this.metadata = metadata;
        this.api = api;
    }

    abstract getEntry: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    abstract listEntries: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    abstract createEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    abstract updateEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    abstract patchEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    abstract removeEntry: (context: ApiEdgeQueryContext, entryFields: any) => Promise<ApiEdgeQueryResponse>;
    abstract exists: (context: ApiEdgeQueryContext) => Promise<ApiEdgeQueryResponse>;
    abstract callMethod: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>;

    protected abstract prepare(): Promise<void>;

    async edge(): Promise<ApiEdgeDefinition> {
        await this.prepare();
        return new ExternalApiEdge(this.metadata, this.api, this)
    }
}

export class ExternalApiEdge extends ApiEdge {
    constructor(metadata: any, api: Api, provider?: ExternalApiProvider) {
        super();

        this.api = api;

        this.name = metadata.name;
        this.pluralName = metadata.pluralName;
        this.idField = metadata.idField;

        const publicSchema: { [key: string]: string } = {};
        metadata.fields.forEach((field: string) => publicSchema[field] = '=');
        this.schema = new ApiEdgeSchema(
            publicSchema,
            metadata.typings
                ? SchemaTypeMapper.importSchema(metadata.typings)
                : null
        );

        const callMethod = provider ? provider.callMethod : async () => new ApiEdgeQueryResponse(null);
        for(let { name, scope, type, parameters } of metadata.methods) {
            this.methods.push(
                new ApiEdgeMethod(name, callMethod, scope, type, parameters, false)
            )
        }

        this.allowGet = metadata.allowGet;
        this.allowList = metadata.allowList;
        this.allowCreate = metadata.allowCreate;
        this.allowUpdate = metadata.allowUpdate;
        this.allowPatch = metadata.allowPatch;
        this.allowRemove = metadata.allowRemove;
        this.allowExists = false; //metadata.allowExists;
        this.external = true;

        this.url = metadata.url;
        if(provider) 
            this.provider = provider;
    }

    url: string;
    provider: ExternalApiProvider;
    api: Api;

    getEntry = (context: ApiEdgeQueryContext): Promise<ApiEdgeQueryResponse> => {
        return this.provider.getEntry(context)
    };

    listEntries = async (context: ApiEdgeQueryContext): Promise<ApiEdgeQueryResponse> => {
        return this.provider.listEntries(context)
    };

    createEntry = async (context: ApiEdgeQueryContext, body: any): Promise<ApiEdgeQueryResponse> => {
        return this.provider.createEntry(context, body)
    };

    updateEntry = async (context: ApiEdgeQueryContext, body: any): Promise<ApiEdgeQueryResponse> => {
        return this.provider.updateEntry(context, body)
    };

    patchEntry = async (context: ApiEdgeQueryContext, body: any): Promise<ApiEdgeQueryResponse> => {
        return this.provider.patchEntry(context, body)
    };

    removeEntry = async (context: ApiEdgeQueryContext, body: any): Promise<ApiEdgeQueryResponse> => {
        return this.provider.removeEntry(context, body)
    };

    exists = async (context: ApiEdgeQueryContext): Promise<ApiEdgeQueryResponse> => {
        return this.provider.exists(context)
    };
}
