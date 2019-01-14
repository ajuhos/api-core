import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {Api} from "../Api";

export interface ExportedApiEdgeRelation {
    type: string
    name: string
    relationId: string
    relatedId: string
    from: string
    to: string
    hasPair: boolean;
}

export type ApiEdgeRelationConstructor = new (from: ApiEdgeDefinition, to: ApiEdgeDefinition) => ApiEdgeRelation;
export const ApiEdgeRelationTypes: { [key: string]: ApiEdgeRelationConstructor } = {};

export abstract class ApiEdgeRelation {
    abstract getType(): string;

    constructor(from: ApiEdgeDefinition, to: ApiEdgeDefinition) {
        this.from = from;
        this.to = to
    }

    name: string;
    relationId: string;
    relatedId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;
    hasPair: boolean;

    toJSON() {
        return {
            type: this.getType(),
            name: this.name,
            relationId: this.relationId,
            relatedId: this.relatedId,
            from: this.from.name,
            to: this.to.name,
            hasPair: this.hasPair
        }
    }

    static fromJSON(obj: ExportedApiEdgeRelation, api: Api): ApiEdgeRelation {
        const Relation = ApiEdgeRelationTypes[obj.type];
        const relation = new Relation(
            api.edges.find(edge => edge.name == obj.from) as any,
            api.edges.find(edge => edge.name == obj.to) as any
        );
        relation.relationId = obj.relationId;
        relation.relatedId = obj.relatedId;
        relation.name = obj.name;
        relation.hasPair = obj.hasPair;
        return relation
    }
}