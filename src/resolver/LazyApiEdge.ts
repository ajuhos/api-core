import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {ApiEdgeAction} from "../edge/ApiEdgeAction";
import {Api} from "../Api";
import {ApiEdgeMethod} from "../edge/ApiEdgeMethod";
import {ApiEdgeRelation} from "../relations/ApiEdgeRelation";
import {ApiEdgeSchema} from "../edge/ApiEdgeSchema";
import {ApiEdgeQueryContext} from "../edge/ApiEdgeQueryContext";

export class LazyApiEdge implements ApiEdgeDefinition {
    private realEdge: ApiEdgeDefinition;
    private readonly resolver: () => Promise<ApiEdgeDefinition|undefined>;

    constructor(api: Api, name: string, plural: boolean, resolver: () => Promise<ApiEdgeDefinition|undefined>) {
        this.api = api;
        this.resolver = resolver;

        if(plural) {
            this.pluralName = name
        }
        else {
            this.name = name
        }
    }

    async resolve() {
        if(!this.realEdge) {
            const realEdge = await this.resolver();
            if (realEdge) {
                this.realEdge = realEdge;
                this.name = realEdge.name;
                this.pluralName = realEdge.pluralName;
                this.relations = realEdge.relations;
                this.methods = realEdge.methods;
                this.actions = realEdge.actions
            }
            else {
                throw new Error('Failed to resolve')
            }
        }
    }

    actions: ApiEdgeAction[] = [];
    methods: ApiEdgeMethod[] = [];
    relations: ApiEdgeRelation[] = [];

    get allowCreate() { return this.realEdge.allowCreate }
    set allowCreate(value: boolean) { this.realEdge.allowCreate = value }
    get allowExists() { return this.realEdge.allowExists }
    set allowExists(value: boolean) { this.realEdge.allowExists = value }
    get allowGet() { return this.realEdge.allowGet }
    set allowGet(value: boolean) { this.realEdge.allowGet = value }
    get allowList() { return this.realEdge.allowList }
    set allowList(value: boolean) { this.realEdge.allowList = value }
    get allowPatch() { return this.realEdge.allowPatch }
    set allowPatch(value: boolean) { this.realEdge.allowPatch = value }
    get allowRemove() { return this.realEdge.allowRemove }
    set allowRemove(value: boolean) { this.realEdge.allowRemove = value }
    get allowUpdate() { return this.realEdge.allowUpdate }
    set allowUpdate(value: boolean) { this.realEdge.allowUpdate = value }

    get idField() { return this.realEdge.idField }
    set idField(value: string) { this.realEdge.idField = value }

    get schema() { return this.realEdge.schema }
    set schema(value: ApiEdgeSchema) { this.realEdge.schema = value }

    api: Api;
    external = true;
    name: string;
    pluralName: string;

    createEntry = async (context: ApiEdgeQueryContext, entryFields: any) => {
        return this.realEdge.createEntry(context, entryFields)
    };

    exists = async (context: ApiEdgeQueryContext) => {
        return this.realEdge.exists(context)
    };

    getEntry = async (context: ApiEdgeQueryContext) => {
        return this.realEdge.getEntry(context)
    };

    listEntries = async (context: ApiEdgeQueryContext) => {
        return this.realEdge.listEntries(context)
    };

    patchEntry = async (context: ApiEdgeQueryContext, entryFields: any) => {
        return this.realEdge.patchEntry(context, entryFields)
    };

    relation = async (name: string) => {
        return this.realEdge.relation(name)
    };

    removeEntry = async (context: ApiEdgeQueryContext, entryFields: any) => {
        return this.realEdge.removeEntry(context, entryFields)
    };

    updateEntry = async (context: ApiEdgeQueryContext, entryFields: any) => {
        return this.realEdge.updateEntry(context, entryFields)
    };

    prepare = () => Promise.resolve();

    metadata = () => this.realEdge.metadata();

    get(key: string): any {
        this.realEdge.get(key)
    }

    set(key: string, value: any): any {
        this.realEdge.set(key, value)
    }
}