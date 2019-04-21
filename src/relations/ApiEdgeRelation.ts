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
        this.to = to;
        this.external = from.external || to.external;
    }

    name: string;
    relationId: string;
    relatedId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;
    hasPair: boolean;
    readonly external: boolean;

    private resolved = false;
    onResolve: () => void = () => {};

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

    static async fromJSON(obj: ExportedApiEdgeRelation, api: Api): Promise<ApiEdgeRelation> {
        const Relation = ApiEdgeRelationTypes[obj.type];
        const relation = new Relation(
            await api.findEdge(obj.from, false) as ApiEdgeDefinition,
            await api.findEdge(obj.to, false) as ApiEdgeDefinition
        );
        relation.relationId = obj.relationId;
        relation.relatedId = obj.relatedId;
        relation.name = obj.name;
        relation.hasPair = obj.hasPair;
        return relation
    }

    async resolve() {
        if(this.resolved) return true;

        if(await this.from.resolve()) {
            if(await this.to.resolve()) {
                this.onResolve();
                this.resolved = true;
                return true
            }
        }

        return false
    }
}