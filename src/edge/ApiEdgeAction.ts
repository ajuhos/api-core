import {QueryStep, ApiQueryScope} from "../query/ApiQuery";
import {ApiEdgeQueryResponse} from "./ApiEdgeQueryResponse";
import {ApiEdgeQueryType} from "./ApiEdgeQueryType";

export enum ApiEdgeActionTrigger {

    Query = 1 << 1,
    Method = 1 << 2,
    Relation = 1 << 3,

    Any = Query | Method | Relation

}

export enum ApiEdgeActionTriggerKind {

    BeforeEvent,
    AfterEvent

}

export class ApiEdgeAction implements QueryStep {
    name: string;

    triggerKind: ApiEdgeActionTriggerKind = ApiEdgeActionTriggerKind.BeforeEvent;
    targetTypes: ApiEdgeQueryType = ApiEdgeQueryType.Any;
    triggers: ApiEdgeActionTrigger = ApiEdgeActionTrigger.Any;
    triggerNames: string[] = [];

    execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>;

    constructor(name: string,
                execute: (scope: ApiQueryScope) => Promise<ApiEdgeQueryResponse>,
                targetTypes: ApiEdgeQueryType = ApiEdgeQueryType.Any,
                triggerKind: ApiEdgeActionTriggerKind = ApiEdgeActionTriggerKind.BeforeEvent,
                triggers: ApiEdgeActionTrigger = ApiEdgeActionTrigger.Any,
                triggerNames: string[] = []) {
        this.name = name;
        this.triggers = triggers;
        this.execute = execute;
        this.targetTypes = targetTypes;
        this.triggerKind = triggerKind;
        this.triggerNames = triggerNames;
    }

    inspect = () => {
        return `action{${this.name}}`
    }
}