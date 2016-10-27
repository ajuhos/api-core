import { ApiEdgeDefinition } from "../edge/ApiEdgeDefinition";
import { ApiEdgeRelation } from "./ApiEdgeRelation";
export declare class OneToOneRelation implements ApiEdgeRelation {
    name: string;
    relationId: string;
    relatedId: string;
    from: ApiEdgeDefinition;
    to: ApiEdgeDefinition;
    constructor(from: ApiEdgeDefinition, to: ApiEdgeDefinition, options?: {
        relationId: string | null;
        relatedId: string | null;
        name: string | null;
    });
}
