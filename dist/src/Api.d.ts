import { ApiEdgeDefinition } from "./edge/ApiEdgeDefinition";
import { ApiRequest } from "./request/ApiRequest";
import { ApiQuery, ApiQueryScope } from "./query/ApiQuery";
import { ApiEdgeRelation } from "./relations/ApiEdgeRelation";
import { ApiAction, ApiActionTriggerKind } from "./query/ApiAction";
export declare class Api {
    static defaultIdPostfix: string;
    static defaultIdField: string;
    version: string;
    edges: ApiEdgeDefinition[];
    actions: ApiAction[];
    private parser;
    private queryBuilder;
    constructor(version: string, ...edges: ApiEdgeDefinition[]);
    findEdge: (name: string | null | undefined) => ApiEdgeDefinition | undefined;
    parseRequest: (requestParts: string[]) => ApiRequest;
    buildQuery: (request: ApiRequest) => ApiQuery;
    edge(edge: ApiEdgeDefinition): this;
    relation(relation: ApiEdgeRelation): this;
    use: (action: ApiAction) => this;
    action: (name: string, execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>, triggerKind?: ApiActionTriggerKind) => Api;
}
