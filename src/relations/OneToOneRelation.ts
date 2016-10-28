import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {ApiEdgeRelation} from "./ApiEdgeRelation";
import {Api} from "../Api";

export class OneToOneRelation implements ApiEdgeRelation {
    name: string;
    relationId: string;
    relatedId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;

    constructor(from: ApiEdgeDefinition,
                to: ApiEdgeDefinition,
                options: { relationId: string|null, relatedId: string|null, name: string|null }
                    = { relationId: null, relatedId: null, name: null }) {

        this.from = from;
        this.to = to;
        this.name = options.name || to.name;
        this.relationId = options.relationId || to.name + Api.defaultIdPostfix;
        this.relatedId = options.relatedId || from.name + Api.defaultIdPostfix;
    }
}