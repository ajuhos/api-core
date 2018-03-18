import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {ApiEdgeRelation, ApiEdgeRelationTypes} from "./ApiEdgeRelation";
import {Api} from "../Api";

export class OneToManyRelation extends ApiEdgeRelation {
    name: string;
    relationId: string;
    relatedId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;

    constructor(from: ApiEdgeDefinition,
                to: ApiEdgeDefinition,
                options: { relationId: string|null, relatedId: string|null, name: string|null}
                    = { relationId: null, relatedId: null, name: null }) {
        super(from, to);
        this.name = options.name || to.pluralName;
        this.relatedId = options.relatedId || to.idField;
        this.relationId = options.relationId || from.name + Api.defaultIdPostfix
    }

    getType() { return 'one-to-many' }
}

ApiEdgeRelationTypes['one-to-many'] = OneToManyRelation;