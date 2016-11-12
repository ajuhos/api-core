import { QueryStep, ApiQueryScope } from "../query/ApiQuery";
export declare enum ApiActionTriggerKind {
    OnInput = 0,
    BeforeOutput = 1,
    AfterOutput = 2,
}
export declare class ApiAction implements QueryStep {
    name: string;
    triggerKind: ApiActionTriggerKind;
    execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>;
    constructor(name: string, execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>, triggerKind?: ApiActionTriggerKind);
    inspect: () => string;
}
