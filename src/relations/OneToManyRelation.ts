import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {ApiEdgeRelation, ApiEdgeRelationTypes} from "./ApiEdgeRelation";
import {Api} from "../Api";

export class OneToManyRelation extends ApiEdgeRelation {
    name: string;
    relationId: string;
    relatedId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;
    hasPair: boolean;

    constructor(from: ApiEdgeDefinition,
                to: ApiEdgeDefinition,
                options: { relationId?: string, relatedId?: string, name?: string, hasPair?: boolean }
                    = { }) {
        super(from, to);
        this.name = options.name || to.pluralName;
        this.relatedId = options.relatedId || from.name + Api.defaultIdPostfix;
        this.relationId = options.relationId || to.idField;
        this.hasPair = options.hasPair || false
    }

    getType() { return 'one-to-many' }
}

ApiEdgeRelationTypes['one-to-many'] = OneToManyRelation;