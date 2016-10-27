import {ApiEdgeDefinition} from "../ApiEdgeDefinition";
import {ApiEdgeQuery} from "../ApiEdgeQuery";
import {ApiEdgeQueryType} from "../ApiEdgeQueryType";
import {ApiEdgeRelation} from "./ApiEdgeRelation";

export class OneToManyRelation implements ApiEdgeRelation {

    name: string;
    relationId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;

    constructor(from: ApiEdgeDefinition,
                to: ApiEdgeDefinition,
                options: { relationId: string, name: string } = { relationId: null, name: null }) {

        this.from = from;
        this.to = to;
        this.name = options.name || to.pluralName;
        this.relationId = options.relationId || to.name + "Id";
    }

    query = (relatedId: string, queryItems: string[]): ApiEdgeQuery => {
        throw "Not Implemented";
    }
}