import {QueryStep, ApiQueryScope} from "../query/ApiQuery";

export enum ApiEdgeMethodScope {

    /**
     * Available for both entries and collections.
     */
    Edge,

    /**
     * Available for single entries.
     */
    Entry,

    /**
     * Available for collections.
     */
    Collection

}

export class ApiEdgeMethod implements QueryStep {
    name: string;
    scope: ApiEdgeMethodScope = ApiEdgeMethodScope.Edge;
    execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>;

    constructor(name: string,
                execute: (scope: ApiQueryScope) => Promise<ApiQueryScope>,
                scope: ApiEdgeMethodScope = ApiEdgeMethodScope.Edge) {
        this.name = name;
        this.scope = scope;
        this.execute = execute;
    }
}