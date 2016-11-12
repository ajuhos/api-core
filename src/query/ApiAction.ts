import {QueryStep, ApiQueryScope} from "../query/ApiQuery";
import {ApiEdgeQueryResponse} from "../edge/ApiEdgeQueryResponse";

export enum ApiActionTriggerKind {

    OnInput,
    BeforeOutput,
    AfterOutput

}

export class ApiAction implements QueryStep {
    name: string;

    triggerKind: ApiActionTriggerKind = ApiActionTriggerKind.OnInput;

    execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>;

    constructor(name: string,
                execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>,
                triggerKind: ApiActionTriggerKind = ApiActionTriggerKind.OnInput) {
        this.name = name;
        this.execute = execute;
        this.triggerKind = triggerKind;
    }

    inspect = () => {
        return `api-action{${this.name}}`
    }
}