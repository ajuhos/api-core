import { QueryStep, ApiQueryScope } from "../query/ApiQuery";
import { ApiEdgeQueryResponse } from "./ApiEdgeQueryResponse";
import { ApiEdgeQueryType } from "./ApiEdgeQueryType";
export declare enum ApiEdgeActionTrigger {
    Query = 2,
    Method = 4,
    Relation = 8,
    Any = 14,
}
export declare enum ApiEdgeActionTriggerKind {
    BeforeEvent = 0,
    AfterEvent = 1,
}
export declare class ApiEdgeAction implements QueryStep {
    name: string;
    triggerKind: ApiEdgeActionTriggerKind;
    targetTypes: ApiEdgeQueryType;
    triggers: ApiEdgeActionTrigger;
    triggerNames: string[];
    execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>;
    constructor(name: string, execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>, targetTypes?: ApiEdgeQueryType, triggerKind?: ApiEdgeActionTriggerKind, triggers?: ApiEdgeActionTrigger, triggerNames?: string[]);
    inspect: () => string;
}
