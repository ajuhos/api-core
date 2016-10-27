import {ApiEdgeDefinition} from "../ApiEdgeDefinition";
import {ApiEdgeQuery} from "../ApiEdgeQuery";
import {ApiEdgeQueryType} from "../ApiEdgeQueryType";
import {ApiEdgeRelation} from "./ApiEdgeRelation";

export class OneToManyRelation implements ApiEdgeRelation {

    name: string;
    relationId: string;
    relatedId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;

    constructor(from: ApiEdgeDefinition,
                to: ApiEdgeDefinition,
                options: { relationId: string, relatedId: string, name: string } = { relationId: null, relatedId: null, name: null }) {

        this.from = from;
        this.to = to;
        this.name = options.name || to.pluralName;
        this.relatedId = options.relatedId || to.name + "Id";
        this.relationId = options.relationId || from.name + "Id";
    }

    query = (relatedId: string, queryItems: string[]): ApiEdgeQuery => {
        throw "Not Implemented";
    }
}