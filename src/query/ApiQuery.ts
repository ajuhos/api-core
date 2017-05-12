import {ApiEdgeQueryContext} from "../edge/ApiEdgeQueryContext";
import {ApiEdgeQueryResponse} from "../edge/ApiEdgeQueryResponse";
import {ApiRequest} from "../request/ApiRequest";


export interface ApiQueryScope {
    context: ApiEdgeQueryContext,
    body: any|null,
    identity: any|null,
    response: ApiEdgeQueryResponse|null,
    query: ApiQuery,
    request: ApiRequest,
    step: number
}

export interface QueryStep {
    execute(scope: ApiQueryScope): Promise<ApiQueryScope>;
}

export class ApiQuery {
    request: ApiRequest;
    steps: QueryStep[] = [];

    unshift = (step: QueryStep): ApiQuery => {
        this.steps.unshift(step);
        return this
    };

/*    push = (step: QueryStep): ApiQuery => {
        this.steps.push(step);
        return this
    };*/

    execute = (identity: any = null): Promise<ApiEdgeQueryResponse> => {
        return new Promise<ApiEdgeQueryResponse>((resolve, reject) => {
            let next = (scope: ApiQueryScope) => {
                let step = this.steps[scope.step];
                if(step) {
                    scope.step++;
                    if (scope.step < this.steps.length) {
                        step.execute(scope).then(next).catch(reject);
                    }
                    else {
                        step.execute(scope).then(scope => resolve(scope.response || new ApiEdgeQueryResponse(null))).catch(reject);
                    }
                }
            };

            next({
                context: new ApiEdgeQueryContext(),
                body: null,
                request: this.request,
                response: null,
                query: this,
                step: 0,
                identity
            });
        })
    }
}
