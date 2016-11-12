import { ApiEdgeAction, ApiEdgeActionTriggerKind } from "./ApiEdgeAction";
import { ApiQuery } from "../query/ApiQuery";
import { ApiEdgeQuery } from "./ApiEdgeQuery";
import { ApiEdgeRelation } from "../relations/ApiEdgeRelation";
export declare class ApiEdgeActionCollection {
    private beforeMethodActions;
    private beforeSubQueryActions;
    private beforeOutputActions;
    private beforeRelationActions;
    private afterMethodActions;
    private afterSubQueryActions;
    private afterOutputActions;
    private afterRelationActions;
    add(action: ApiEdgeAction): void;
    getFor(triggerKind: ApiEdgeActionTriggerKind, query: ApiQuery, edgeQuery: ApiEdgeQuery, relation: ApiEdgeRelation | null, output?: boolean): void;
}
