import {ApiEdgeQueryContext} from "../edge/ApiEdgeQueryContext";
import {ApiEdgeQueryResponse} from "../edge/ApiEdgeQueryResponse";


export interface ApiQueryScope {
    context: ApiEdgeQueryContext,
    body: any|null,
    response: ApiEdgeQueryResponse|null
}

export interface QueryStep {
    execute(scope: ApiQueryScope): Promise<ApiQueryScope>;
}

export class ApiQuery {
    steps: QueryStep[] = [];

    unshift = (step: QueryStep): ApiQuery => {
        this.steps.unshift(step);
        return this
    };

/*    push = (step: QueryStep): ApiQuery => {
        this.steps.push(step);
        return this
    };*/

    execute = (): Promise<ApiEdgeQueryResponse> => {
        return new Promise<ApiEdgeQueryResponse>((resolve, reject) => {
            let next = (scope: ApiQueryScope) => {
                let step = this.steps.shift();
                if(step) {
                    if (this.steps.length) {
                        step.execute(scope).then(next).catch(reject);
                    }
                    else {
                        step.execute(scope).then(scope => resolve(scope.response || new ApiEdgeQueryResponse(null))).catch(reject);
                    }
                }
            };

            next({ context: new ApiEdgeQueryContext(), body: null, response: null});
        })
    }
}
