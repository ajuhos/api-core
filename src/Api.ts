import {ApiEdgeDefinition} from "./edge/ApiEdgeDefinition";
import {ApiRequestParser} from "./request/ApiRequestParser";
import {ApiQueryBuilder} from "./query/ApiQueryBuilder";
import {ApiRequest} from "./request/ApiRequest";
import {ApiQuery} from "./query/ApiQuery";
import {ApiEdgeRelation} from "./relations/ApiEdgeRelation";

export class Api {
    static defaultIdPostfix: string = "Id";
    static defaultIdField: string = "id";

    version: string;
    edges: ApiEdgeDefinition[] = [];
    private parser: ApiRequestParser;
    private queryBuilder: ApiQueryBuilder;

    constructor(version: string, ...edges: ApiEdgeDefinition[]) {
        this.version = version;
        this.edges = edges;
        this.parser = new ApiRequestParser(this);
        this.queryBuilder = new ApiQueryBuilder(this);
    }

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

}
