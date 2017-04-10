import { QueryStep, ApiQueryScope } from "../query/ApiQuery";
import { ApiEdgeQueryType } from "./ApiEdgeQueryType";
export declare enum ApiEdgeActionTrigger {
    OutputQuery = 2,
    SubQuery = 4,
    Method = 8,
    Relation = 16,
    Query = 6,
    Any = 30,
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
    constructor(name: string, execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>, targetTypes?: ApiEdgeQueryType, triggerKind?: ApiEdgeActionTriggerKind, triggers?: ApiEdgeActionTrigger, triggerNames?: string[]);
    inspect: () => string;
}
