import {ApiEdgeDefinition} from "../ApiEdgeDefinition";
import {ApiEdgeQuery} from "../ApiEdgeQuery";
import {ApiEdgeQueryType} from "../ApiEdgeQueryType";
import {ApiEdgeRelation} from "./ApiEdgeRelation";

export class OneToManyRelation implements ApiEdgeRelation {

    name: string;
    relationId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;

    constructor(name: string, from: ApiEdgeDefinition, to: ApiEdgeDefinition, relationId: string = null) {
        this.name = name;
        this.from = from;
        this.to = to;
        this.relationId = relationId || this.to.name + "Id";
    }

    query = (relatedId: string, queryItems: string[]): ApiEdgeQuery => {
        throw "Not Implemented";
    }
}