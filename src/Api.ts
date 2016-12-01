import {ApiEdgeDefinition} from "./edge/ApiEdgeDefinition";
import {ApiRequestParser} from "./request/ApiRequestParser";
import {ApiQueryBuilder} from "./query/ApiQueryBuilder";
import {ApiRequest} from "./request/ApiRequest";
import {ApiQuery, ApiQueryScope} from "./query/ApiQuery";
import {ApiEdgeRelation} from "./relations/ApiEdgeRelation";
import {ApiAction, ApiActionTriggerKind} from "./query/ApiAction";
import {ApiEdgeQueryResponse} from "./edge/ApiEdgeQueryResponse";

export class Api {
    static defaultIdPostfix: string = "Id";
    static defaultIdField: string = "id";

    version: string;
    edges: ApiEdgeDefinition[] = [];
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

}
