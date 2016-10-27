import { ApiEdgeDefinition } from "./edge/ApiEdgeDefinition";
import { ApiRequest } from "./request/ApiRequest";
import { ApiQuery } from "./query/ApiQuery";
import { ApiEdgeRelation } from "./relations/ApiEdgeRelation";
export declare class Api {
    version: string;
    edges: ApiEdgeDefinition[];
    private parser;
    private queryBuilder;
    constructor(version: string, ...edges: ApiEdgeDefinition[]);
    parseRequest: (requestParts: string[]) => ApiRequest;
    buildQuery: (request: ApiRequest) => ApiQuery;
    edge(edge: ApiEdgeDefinition): this;
    relation(relation: ApiEdgeRelation): this;
}
