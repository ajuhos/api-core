import {ApiEdgeDefinition, ApiEdgeMetadata} from "./edge/ApiEdgeDefinition";
import {ApiRequestParser} from "./request/ApiRequestParser";
import {ApiQueryBuilder} from "./query/ApiQueryBuilder";
import {ApiRequest} from "./request/ApiRequest";
import {ApiQuery, ApiQueryScope} from "./query/ApiQuery";
import {ApiEdgeRelation, ExportedApiEdgeRelation} from "./relations/ApiEdgeRelation";
import {ApiAction, ApiActionTriggerKind} from "./query/ApiAction";
import {ApiEdgeQueryResponse} from "./edge/ApiEdgeQueryResponse";
import {ExternalApiEdge} from "./edge/ExternalApiEdge";

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
    info: ApiInfo
    version: string
    edges: ApiEdgeMetadata[]
    relations: ExportedApiEdgeRelation[]
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

    constructor(version: string, ...edges: ApiEdgeDefinition[]) {
        this.version = version;
        this.edges = edges;
        this.parser = new ApiRequestParser(this);
        this.queryBuilder = new ApiQueryBuilder(this);
    }

    findEdge = (name: string|null|undefined) => {
        return this.edges.find((edge: ApiEdgeDefinition) => edge.pluralName == name)
    };

    parseRequest = (requestParts: string[]) => {
        return this.parser.parse(requestParts);
    };

    buildQuery = (request: ApiRequest): ApiQuery => {
        return this.queryBuilder.build(request);
    };

    edge(edge: ApiEdgeDefinition) {
        this.edges.push(edge);
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
            info: this.info || { title: 'API' },
            version: this.version,
            edges: this.edges.map(edge => edge.metadata()),
            relations: this.relations.map(relation => relation.toJSON())
        }
    };

    static fromMetadata(metadata: ApiMetadata): Api {
        const api = new Api(metadata.version);
        api.info = metadata.info;

        for(let edge of metadata.edges) {
            //if(edge.external) continue; -- TODO
            api.edge(new ExternalApiEdge(edge))
        }

        for(let relation of metadata.relations) {
            api.relation(ApiEdgeRelation.fromJSON(relation, api))
        }

        return api
    }

}
