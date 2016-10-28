import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {ApiEdgeRelation} from "./ApiEdgeRelation";
import {Api} from "../Api";

export class OneToManyRelation implements ApiEdgeRelation {
    name: string;
    relationId: string;
    relatedId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;

    constructor(from: ApiEdgeDefinition,
                to: ApiEdgeDefinition,
                options: { relationId: string|null, relatedId: string|null, name: string|null}
                    = { relationId: null, relatedId: null, name: null }) {
        this.from = from;
        this.to = to;
        this.name = options.name || to.pluralName;
        this.relatedId = options.relatedId || to.name + Api.defaultIdPostfix;
        this.relationId = options.relationId || from.name + Api.defaultIdPostfix;
    }
}