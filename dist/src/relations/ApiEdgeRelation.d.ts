import { ApiEdgeDefinition } from "../edge/ApiEdgeDefinition";
export interface ApiEdgeRelation {
    name: string;
    relationId: string;
    relatedId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;
}
