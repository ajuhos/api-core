import {ApiEdgeDefinition, ApiEdgeMetadata} from "./edge/ApiEdgeDefinition";
import {ApiRequestParser} from "./request/ApiRequestParser";
import {ApiQueryBuilder} from "./query/ApiQueryBuilder";
import {ApiRequest, ApiRequestType} from "./request/ApiRequest";
import {ApiQuery, ApiQueryScope} from "./query/ApiQuery";
import {ApiEdgeRelation, ExportedApiEdgeRelation} from "./relations/ApiEdgeRelation";
import {ApiAction, ApiActionTriggerKind} from "./query/ApiAction";
import {ExternalApiEdge} from "./edge/ExternalApiEdge";
const pkg = require('../../package.json');

export interface ApiInfo {
    title: string
    description?: string
    termsOfService?: string
    contact?: {
        name?: string
        url?: string
        email?: string
    }
    license?: {
        name: string,
        url?: string
    }
}

export interface ApiMetadata {
    'api-core': string
    info: ApiInfo
    version: string
    edges: ApiEdgeMetadata[]
    relations: ExportedApiEdgeRelation[]
}

export interface ApiResolver {
    resolveEdge(name: string, plural: boolean): Promise<ApiEdgeDefinition|undefined>;
    resolveRelation(name: string): Promise<ApiEdgeRelation|undefined>;
    resolveRelationOfEdge(edge: string, name: string): Promise<ApiEdgeRelation|undefined>;
    resolveRelationTo(edge: string, name: string): Promise<ApiEdgeRelation|undefined>;
    resolveRelationFrom(edge: string, name: string): Promise<ApiEdgeRelation|undefined>;
}

export class LocalApiResolver implements ApiResolver {
    private readonly api: Api;

    constructor(api: Api) {
        this.api = api
    }

    resolveEdge(name: string, plural: boolean) {
        if(plural) {
            return Promise.resolve(
                this.api.edges.find(edge => edge.pluralName == name)
            )
        }
        else {
            return Promise.resolve(
                this.api.edges.find(edge => edge.name == name)
            )
        }
    }

    resolveRelation(name: string) {
        return Promise.resolve(
            this.api.relations.find(relation => relation.name === name)
        )
    }

    resolveRelationOfEdge(edge: string, name: string) {
        return Promise.resolve(
            this.api.relations.find(relation =>
                relation.name === name && (relation.from.pluralName === edge || relation.to.pluralName === edge)
            )
        )
    }

    resolveRelationFrom(edge: string, name: string) {
        return Promise.resolve(
            this.api.relations.find(relation =>
                relation.name === name && relation.from.pluralName === edge
            )
        )
    }

    resolveRelationTo(edge: string, name: string) {
        return Promise.resolve(
            this.api.relations.find(relation =>
                relation.name === name && relation.to.pluralName === edge
            )
        )
    }
}

export class Api {
    static defaultIdPostfix: string = "Id";
    static defaultIdField: string = "id";

    url?: string;
    info?: ApiInfo;
    version: string;

    edges: ApiEdgeDefinition[] = [];
    relations: ApiEdgeRelation[] = [];
    actions: ApiAction[] = [];
    private parser: ApiRequestParser;
    private queryBuilder: ApiQueryBuilder;
    private resolver: ApiResolver;

    constructor(version: string, ...edges: ApiEdgeDefinition[]) {
        this.version = version;
        this.edges = edges;
        this.parser = new ApiRequestParser(this);
        this.queryBuilder = new ApiQueryBuilder(this);
        this.resolver = new LocalApiResolver(this)
    }

    findEdge = (name: string, plural = true) => {
        return this.resolver.resolveEdge(name, plural)
    };

    findRelation(name: string) {
        return this.resolver.resolveRelation(name)
    }

    findRelationOfEdge(edge: string|ApiEdgeDefinition, name: string) {
        const edgeName = (edge as any).pluralName || edge;
        return this.resolver.resolveRelationOfEdge(edgeName, name)
    }

    findRelationTo(edge: string|ApiEdgeDefinition, name: string) {
        const edgeName = (edge as any).pluralName || edge;
        return this.resolver.resolveRelationTo(edgeName, name)
    }

    findRelationFrom(edge: string|ApiEdgeDefinition, name: string) {
        const edgeName = (edge as any).pluralName || edge;
        return this.resolver.resolveRelationFrom(edgeName, name)
    }

    parseRequest = async (requestParts: string[], type: ApiRequestType|null = null) => {
        const result = await this.parser.parse(requestParts);
        if(type) result.type = type;
        return result
    };

    buildQuery = (request: ApiRequest): ApiQuery => {
        const query = this.queryBuilder.build(request);
        query.request = request;
        return query
    };

    edge(edge: ApiEdgeDefinition) {
        this.edges.push(edge);
        edge.api = this;
        return this
    };

    relation(relation: ApiEdgeRelation) {
        relation.from.relations.push(relation);
        relation.to.relations.push(relation);
        this.relations.push(relation);
        return this
    }

    use = (action: ApiAction) => {
        this.actions.unshift(action);
        return this
    };

    action = (name: string,
              execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>,
              triggerKind: ApiActionTriggerKind = ApiActionTriggerKind.OnInput): Api => {
        this.actions.unshift(new ApiAction(name, execute, triggerKind));
        return this
    };

    metadata = (): ApiMetadata => {
        return {
            'api-core': pkg.version,
            info: this.info || { title: 'API' },
            version: this.version,
            edges: this.edges.map(edge => edge.metadata()),
            relations: this.relations.map(relation => relation.toJSON())
        }
    };

    static async fromMetadata(metadata: ApiMetadata): Promise<Api> {
        const api = new Api(metadata.version);
        api.info = metadata.info;

        for(let edge of metadata.edges) {
            //if(edge.external) continue; -- TODO
            api.edge(new ExternalApiEdge(edge))
        }

        for(let relation of metadata.relations) {
            api.relation(await ApiEdgeRelation.fromJSON(relation, api))
        }

        return api
    }

    async prepare() {
        for(let edge of this.edges) {
            await edge.prepare(this)
        }
    }

}
