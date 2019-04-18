import {ApiQuery, ApiQueryScope, QueryStep} from "./ApiQuery";
import {ApiEdgeQuery} from "../edge/ApiEdgeQuery";
import {ApiEdgeQueryContext} from "../edge/ApiEdgeQueryContext";
import {ApiEdgeRelation} from "../relations/ApiEdgeRelation";
import {ApiEdgeError} from "./ApiEdgeError";
import {ApiEdgeQueryFilter, ApiEdgeQueryFilterType} from "../edge/ApiEdgeQueryFilter";
import {
    ApiRequest,
    ApiRequestType,
    EdgePathSegment,
    EntryPathSegment,
    MethodPathSegment,
    PathSegment,
    RelatedFieldPathSegment
} from "../request/ApiRequest";
import {ApiEdgeQueryResponse} from "../edge/ApiEdgeQueryResponse";
import {ApiEdgeQueryType} from "../edge/ApiEdgeQueryType";
import {OneToOneRelation} from "../relations/OneToOneRelation";
import {Api} from "../Api";
import {ApiEdgeMethod, ApiEdgeMethodScope} from "../edge/ApiEdgeMethod";
import {ApiEdgeAction, ApiEdgeActionTrigger, ApiEdgeActionTriggerKind} from "../edge/ApiEdgeAction";
import {ApiAction, ApiActionTriggerKind} from "./ApiAction";
import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {OneToManyRelation} from "../relations/OneToManyRelation";

const parse = require('obj-parse');
const debug = require('debug')('api-core');

export class EmbedQueryQueryStep implements QueryStep {
    query: ApiQuery;
    request: ApiRequest;
    segment: PathSegment;
    sourceField: string;
    targetField: string;
    idField: string;
    forceArray: boolean;
    isMultiMulti: boolean;

    constructor(query: ApiQuery, segment: PathSegment, request: ApiRequest) {
        this.query = query;
        this.query.request = this.request = request;
        this.segment = segment;

        if(!this.segment.relation) throw new Error('Invalid relation provided.');
        this.sourceField = this.segment.relation.relationId;
        this.targetField = this.segment.relation.name;
        this.idField = this.segment.relation.relatedId;
        this.forceArray = this.segment.relation instanceof OneToManyRelation;
        this.isMultiMulti = this.segment.relation.hasPair;
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise((resolve, reject) => {
            debug(`[${scope.query.id}]`, this.inspect());
            if(scope.response) {
                const target = scope.response.data;

                if(Array.isArray(target)) {
                    const targetIndex: { [key: string]: any[] } = {},
                        targetArrayIndex: { [key: string]: any[] } = {},
                        ids: string[] = [];

                    for(let entry of target) {
                        const id = entry[this.sourceField];
                        if(id) {
                            if(Array.isArray(id)) {
                                for(let _id of id) {
                                    if (targetArrayIndex[_id]) targetArrayIndex[_id].push(entry);
                                    else targetArrayIndex[_id] = [entry];
                                    ids.push(_id);
                                }
                                entry[this.sourceField] = [];
                            }
                            else if(this.forceArray) {
                                if (targetArrayIndex[id]) targetArrayIndex[id].push(entry);
                                else targetArrayIndex[id] = [entry];
                                ids.push(id);
                                entry[this.targetField] = [];
                            }
                            else {
                                if (targetIndex[id]) targetIndex[id].push(entry);
                                else targetIndex[id] = [entry];
                                ids.push(id);
                            }
                        }
                    }

                    this.request.context.filters = [
                        new ApiEdgeQueryFilter(this.idField, ApiEdgeQueryFilterType.In, ids)
                    ];

                    this.query.execute(scope.identity).then((response) => {
                        if(response.data && response.data.length) {
                            for (let entry of response.data) {
                                let ids = entry[this.idField];
                                if(!Array.isArray(ids)) {
                                    ids = [ids];
                                }

                                for(let id of ids) {
                                    if (targetIndex[id]) {
                                        for (let subEntry of targetIndex[id]) {
                                            subEntry[this.targetField] = entry;
                                        }
                                    }
                                    if(targetArrayIndex[id]) {
                                        for (let subEntry of targetArrayIndex[id]) {
                                            subEntry[this.targetField].push(entry);
                                        }
                                    }
                                }
                            }
                        }
                        resolve(scope)
                    }).catch(reject);
                }
                else {
                    const sourceId = target[this.sourceField];
                    let arrayRequest = false;

                    if(Array.isArray(sourceId)) {
                        arrayRequest = true;
                        this.request.context.filters = [
                            new ApiEdgeQueryFilter(this.idField, ApiEdgeQueryFilterType.In, sourceId)
                        ];
                    }
                    else if(this.forceArray) {
                        arrayRequest = true;
                        this.request.context.filters = [
                            new ApiEdgeQueryFilter(this.idField, ApiEdgeQueryFilterType.Equals, sourceId)
                        ];
                    }
                    else {
                        //Now we can replace TBD and provide a real id for the query.
                        (this.segment as EntryPathSegment).id = sourceId;
                    }

                    this.query.execute(scope.identity).then((response) => {
                        target[this.targetField] = response.data;
                        resolve(scope)
                    }).catch(reject);
                }
            }
            else resolve(scope)
        })
    };

    inspect = () => `EMBED QUERY /${this.sourceField} -> ${this.targetField}`;
}

export class QueryEdgeQueryStep implements QueryStep {
    query: ApiEdgeQuery;

    constructor(query: ApiEdgeQuery) {
        this.query = query;
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise((resolve, reject) => {
            debug(`[${scope.query.id}]`, this.inspect());

            if(this.query.type !== ApiEdgeQueryType.Get && this.query.type !== ApiEdgeQueryType.List) {
                this.query.body = scope.body;
            }

            this.query.context = scope.context;

            this.query.execute().then((response) => {
                scope.context = new ApiEdgeQueryContext();
                scope.response = response;
                resolve(scope)
            }).catch(reject);
        })
    };

    inspect = () => `QUERY /${this.query.edge.pluralName}`;
}

export class CallMethodQueryStep implements QueryStep {
    method: ApiEdgeMethod;
    edge: ApiEdgeDefinition;

    constructor(method: ApiEdgeMethod, edge: ApiEdgeDefinition) {
        this.method = method;
        this.edge = edge;
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise((resolve, reject) => {
            debug(`[${scope.query.id}]`, this.inspect());

            this.method.execute(scope)
                .then((response) => {
                    scope.response = response;
                    resolve(scope)
                }).catch((e) => {
                    debug(`failed to execute ${this.method.name} method`, e);
                    reject(e)
                });
        })
    };

    inspect = () => `call{${this.method.name}}`;
}

export class RelateQueryStep implements QueryStep {
    relation: ApiEdgeRelation;

    constructor(relation: ApiEdgeRelation) {
        this.relation = relation;
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise((resolve, reject) => {
            debug(`[${scope.query.id}]`, this.inspect());

            if(!scope.response) return reject(new ApiEdgeError(404, "Missing Related Entry"));
            scope.context.filter(this.relation.relationId, ApiEdgeQueryFilterType.Equals, scope.response.data[this.relation.relatedId]);
            resolve(scope);
        })
    };

    inspect = () => `RELATE ${this.relation.relationId} = ${this.relation.relatedId}`;
}

export class RelateBackwardsQueryStep implements QueryStep {
    relation: ApiEdgeRelation;

    constructor(relation: ApiEdgeRelation) {
        this.relation = relation;
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise((resolve, reject) => {
            debug(`[${scope.query.id}]`, this.inspect());

            if(!scope.response) return reject(new ApiEdgeError(404, "Missing Related Entry"));
            scope.context.filter(this.relation.relatedId, ApiEdgeQueryFilterType.Equals, scope.response.data[this.relation.relationId]);
            resolve(scope);
        })
    };

    inspect = () => `RELATE ${this.relation.relatedId} = ${this.relation.relationId}`;
}

export class RelateChangeQueryStep implements QueryStep {
    relation: ApiEdgeRelation;

    constructor(relation: ApiEdgeRelation) {
        this.relation = relation;
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise((resolve, reject) => {
            debug(`[${scope.query.id}]`, this.inspect());

            if(!scope.body) return reject(new ApiEdgeError(404, "Missing Body"));
            if(!scope.response) return reject(new ApiEdgeError(404, "Missing Related Entry"));
            parse(this.relation.relationId).assign(
                scope.body,
                scope.response.data[this.relation.relatedId]);
            resolve(scope);
        })
    };

    inspect = () => `RELATE CHANGE ${this.relation.relationId}`;
}

/*export class CheckResponseQueryStep implements QueryStep {
    execute = (scope: QueryScope) => {
        return new Promise((resolve, reject) => {
            if(!scope.response) return reject(new ApiEdgeError(404, "Missing Related Entry"));
            resolve(scope);
        })
    };

    inspect = () => `CHECK`;
}

export class NotImplementedQueryStep implements QueryStep {
    description: string;

    constructor(description: string) {
        this.description = description;
    }

    execute = (scope: QueryScope) => {
        return new Promise(resolve => {
            resolve(scope);
        })
    };

    inspect = () => `NOT IMPLEMENTED: ${this.description}`;
}*/

export class SetResponseQueryStep implements QueryStep {
    response: ApiEdgeQueryResponse;

    constructor(response: ApiEdgeQueryResponse) {
        this.response = response;
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise(resolve => {
            debug(`[${scope.query.id}]`, this.inspect());

            scope.response = this.response;
            scope.context = new ApiEdgeQueryContext();
            resolve(scope);
        })
    };

    inspect = () => `SET RESPONSE`;
}

export class SetBodyQueryStep implements QueryStep {
    body: any;
    stream: NodeJS.ReadableStream|null;

    constructor(body: any, stream: NodeJS.ReadableStream|null = null) {
        this.body = body;
        this.stream = stream
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise(resolve => {
            debug(`[${scope.query.id}]`, this.inspect());

            scope.body = this.body;
            scope.stream = this.stream;
            resolve(scope);
        })
    };

    inspect = () => `SET BODY`;
}

export class ProvideIdQueryStep implements QueryStep {
    fieldName: string;

    constructor(fieldName: string = Api.defaultIdField) {
        this.fieldName = fieldName;
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise((resolve, reject) => {
            debug(`[${scope.query.id}]`, this.inspect());

            if(!scope.response) return reject(new ApiEdgeError(404, "Missing Entry"));
            scope.context.id = scope.response.data[this.fieldName];
            resolve(scope);
        })
    };

    inspect = () => `PROVIDE ID: ${this.fieldName}`;
}

export class ExtendContextQueryStep implements QueryStep {
    context: ApiEdgeQueryContext;

    constructor(context: ApiEdgeQueryContext) {
        this.context = context
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise(resolve => {
            debug(`[${scope.query.id}]`, this.inspect());

            scope.context.id = this.context.id || scope.context.id;
            if(this.context.pagination) {
                scope.context.pagination = this.context.pagination;
            }
            this.context.fields.forEach(f => scope.context.fields.push(f));
            this.context.populatedRelations.forEach(f => scope.context.populatedRelations.push(f));
            this.context.filters.forEach(f => scope.context.filters.push(f));
            this.context.sortBy.forEach(f => scope.context.sortBy.push(f));
            resolve(scope)
        })
    };

    inspect = () => {
        if(this.context.id) {
            return `EXTEND CONTEXT (id=${this.context.id})`
        }
        else {
            return `APPLY PARAMETERS`
        }
    };
}

export class ExtendContextLiveQueryStep implements QueryStep {
    apply: (context: ApiEdgeQueryContext) => void|any;

    constructor(func: (context: ApiEdgeQueryContext) => void|any) {
        this.apply = func
    }

    execute = (scope: ApiQueryScope): Promise<ApiQueryScope> => {
        return new Promise(resolve => {
            debug(`[${scope.query.id}]`, this.inspect());

            this.apply(scope.context);
            resolve(scope)
        })
    };

    inspect = () => {
        return `EXTEND CONTEXT LIVE`
    };
}

/*export class GenericQueryStep implements QueryStep {
    description: string;
    step: () => Promise<QueryScope>;
    context: any;

    constructor(description: string, step: () => Promise<QueryScope>, context: any) {
        this.description = description;
        this.step = step;
        this.context = context;
    }

    execute = (scope: QueryScope) => {
        return this.step.apply(this.context, [ scope ]);
    };

    inspect = () => this.description
}*/

export class ApiQueryBuilder {
    api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    private addQueryActions(triggerKind: ApiEdgeActionTriggerKind,
                            query: ApiQuery,
                            edgeQuery: ApiEdgeQuery,
                            relation: ApiEdgeRelation|null,
                            output: boolean = false) {
        const edge = edgeQuery.edge,
            queryType = edgeQuery.type,
            trigger = relation ?
                ApiEdgeActionTrigger.Relation :
                (output ? ApiEdgeActionTrigger.OutputQuery : ApiEdgeActionTrigger.SubQuery);

        let actions: ApiEdgeAction[];
        if(relation) {
            actions = edge.actions.filter((action: ApiEdgeAction) =>
                action.triggerKind == triggerKind &&
                (action.targetTypes & queryType) &&
                (action.triggers & trigger) &&
                (!action.triggerNames.length || action.triggerNames.indexOf(relation.name) == -1))
        }
        else {
            actions = edge.actions.filter((action: ApiEdgeAction) =>
                action.triggerKind == triggerKind &&
                (action.targetTypes & queryType) &&
                (action.triggers & trigger))
        }

        actions.forEach((action: ApiEdgeAction) => query.unshift(action));

        if(output) {
            const apiTrigger = triggerKind == ApiEdgeActionTriggerKind.BeforeEvent ?
                ApiActionTriggerKind.BeforeOutput : ApiActionTriggerKind.AfterOutput;
            this.api.actions
                .filter((action: ApiAction) => action.triggerKind == apiTrigger)
                .forEach((action: ApiAction) => query.unshift(action))
        }
    }

    private static addMethodCallStep(request: ApiRequest, query: ApiQuery, method: ApiEdgeMethod, edge: ApiEdgeDefinition) {
        if(method.acceptedTypes & request.type) {
            //TODO: this.addPostMethodActions(request, query, method);
            query.unshift(new CallMethodQueryStep(method, edge));
            //TODO: this.addPreMethodActions(request, query, method);
        }
        else {
            throw new ApiEdgeError(405, "Method Not Allowed");
        }
    }

    private addQueryStep(query: ApiQuery,
                         step: QueryEdgeQueryStep,
                         relation: ApiEdgeRelation|null = null,
                         output: boolean = false) {
        this.addQueryActions(ApiEdgeActionTriggerKind.AfterEvent, query, step.query, relation, output);
        query.unshift(step);
        this.addQueryActions(ApiEdgeActionTriggerKind.BeforeEvent, query, step.query, relation, output);
    }

    private static buildProvideIdStep(query: ApiQuery, currentSegment: PathSegment): boolean {
        if(currentSegment instanceof EntryPathSegment) {
            query.unshift(new ExtendContextLiveQueryStep(context => context.id = currentSegment.id));
            return false
        }
        else if(currentSegment instanceof RelatedFieldPathSegment) {
            query.unshift(new ProvideIdQueryStep(currentSegment.relation.relationId));
            return true
        }
        else {
            //TODO: Add support for method calls with parameters
            return false
        }
    }

    private buildCheckStep(query: ApiQuery, currentSegment: PathSegment): boolean {
        //STEP 1: Create the check query.
        //TODO: Check this code...
        if(currentSegment instanceof EntryPathSegment) {
            query.unshift(new SetResponseQueryStep(new ApiEdgeQueryResponse({ [currentSegment.edge.idField||Api.defaultIdField]: currentSegment.id })));
            return false
        }
        else if(currentSegment instanceof RelatedFieldPathSegment) {
            this.addQueryStep(query, new QueryEdgeQueryStep(new ApiEdgeQuery(currentSegment.relation.to, ApiEdgeQueryType.Get)), currentSegment.relation);
        }
        else {
            //TODO: Add support for method calls (non-base query case)
            throw new ApiEdgeError(500, "Not Implemented")
        }

        //STEP 2: Provide ID for the check query.
        return ApiQueryBuilder.buildProvideIdStep(query, currentSegment)
    }

    private buildReadStep(query: ApiQuery, currentSegment: PathSegment): boolean {
        //STEP 1: Create the read query.
        if(currentSegment instanceof RelatedFieldPathSegment) {
            this.addQueryStep(query, new QueryEdgeQueryStep(new ApiEdgeQuery(currentSegment.relation.to, ApiEdgeQueryType.Get)), currentSegment.relation);
        }
        else {
            this.addQueryStep(query, new QueryEdgeQueryStep(new ApiEdgeQuery(currentSegment.edge, ApiEdgeQueryType.Get)));
        }

        //STEP 2: Provide ID for the read query.
        return ApiQueryBuilder.buildProvideIdStep(query, currentSegment)
    }

    private buildEmbedSteps(query: ApiQuery, request: ApiRequest, lastSegment: PathSegment) {
        if(request.type === ApiRequestType.Read && lastSegment instanceof EdgePathSegment) {
            for (let relation of request.context.populatedRelations) {
                const segment = new EdgePathSegment(relation.to, relation);

                const embedRequest = new ApiRequest(request.api);
                embedRequest.path.add(segment);

                // We add the step directly directly, as pre- and post-actions are not
                // supported on embed query steps. These actions will be executed as
                // part of the sub-query.
                query.unshift(new EmbedQueryQueryStep(this.build(embedRequest), segment, embedRequest));
            }
        }
        else {
            for (let relation of request.context.populatedRelations) {
                let segment: EdgePathSegment|EntryPathSegment;

                if(relation instanceof OneToManyRelation) {
                    // TODO: Should we specify exactly array relations?
                    segment = new EdgePathSegment(relation.to, relation);
                }
                else {
                    // The id is literally TBD, it is going to be set once we have the data,
                    // what we build now is only an execution plan.
                    segment = new EntryPathSegment(relation.to, 'TBD', relation);
                }

                const embedRequest = new ApiRequest(request.api);
                embedRequest.path.add(segment);

                // We add the step directly, as pre- and post-actions are not
                // supported on embed query steps. These actions will be executed as
                // part of the sub-query.
                query.unshift(new EmbedQueryQueryStep(this.build(embedRequest), segment, embedRequest));
            }
        }
    }

    private buildReadQuery = (request: ApiRequest): ApiQuery => {
        let query = new ApiQuery();

        let segments = request.path.segments,
            lastSegment = segments[segments.length-1];

        //STEP 0: Create embed queries
        this.buildEmbedSteps(query, request, lastSegment);

        //STEP 1: Create the base query which will provide the final data.
        let readMode = true;
        let baseQuery: ApiEdgeQuery;
        if(lastSegment instanceof EdgePathSegment) {
            baseQuery = new ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType.List);
            this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
        }
        else if(lastSegment instanceof RelatedFieldPathSegment) {
            baseQuery = new ApiEdgeQuery(lastSegment.relation.to, ApiEdgeQueryType.Get);
            this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), lastSegment.relation, true);

        }
        else if(lastSegment instanceof MethodPathSegment) {
            ApiQueryBuilder.addMethodCallStep(request, query, lastSegment.method, lastSegment.edge);
            if(lastSegment.method.scope === ApiEdgeMethodScope.Entry) {
                //TODO: Add support for providing id for Edge methods.
                query.unshift(new ProvideIdQueryStep(lastSegment.edge.idField));
            }
            readMode = lastSegment.method.requiresData;
        }
        else {
            baseQuery = new ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType.Get);
            this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
        }

        //STEP 2: Provide context for the base query.
        query.unshift(new ExtendContextQueryStep(request.context));

        //STEP 3: Provide ID for the base query.
        if(lastSegment instanceof EntryPathSegment) {
            const _segment = lastSegment; //Add closure to make sure it won't be overridden later.
            query.unshift(new ExtendContextLiveQueryStep(context => context.id = _segment.id))
        }
        else if(lastSegment instanceof RelatedFieldPathSegment) {
            if(lastSegment.relation.relatedId !== lastSegment.relation.to.idField) {
                query.unshift(new RelateBackwardsQueryStep(lastSegment.relation));
            }
            else {
                query.unshift(new ProvideIdQueryStep(lastSegment.relation.relationId))
            }
        }
        else {
            //TODO: Add support for method calls with parameters
        }

        //STEP 4: Provide filters and validation for the base query.
        for(let i = segments.length-2; i >= 0; i--) {
            let currentSegment = segments[i];

            //STEP 1: Relate to the current query.
            let relation = segments[i+1].relation;
            let edge = segments[i+1].edge;
            if(relation && !(relation instanceof OneToOneRelation)) {
                if(edge === relation.to) {
                    query.unshift(new RelateBackwardsQueryStep(relation));
                }
                else {
                    query.unshift(new RelateQueryStep(relation));
                }
            }

            //STEP 2: Read or Check
            if(readMode) {
                readMode = this.buildReadStep(query, currentSegment)
            }
            else {
                readMode = this.buildCheckStep(query, currentSegment)
            }
        }

        //STEP 5: Add OnInput actions
        this.api.actions
            .filter((action: ApiAction) => action.triggerKind == ApiActionTriggerKind.OnInput)
            .forEach((action: ApiAction) => query.unshift(action));

        //STEP 6: Return the completed query.
        return query
    };

    private buildChangeQuery = (request: ApiRequest): ApiQuery => {
        let query = new ApiQuery();

        let segments = request.path.segments,
            lastSegment = segments[segments.length-1],
            readMode = true;

        //STEP 0: Create embed queries
        this.buildEmbedSteps(query, request, lastSegment);

        //STEP 1: Create the base query which will provide the final data.
        let baseQuery: ApiEdgeQuery;
        if(lastSegment instanceof RelatedFieldPathSegment) {
            if(request.type === ApiRequestType.Update) {
                baseQuery = new ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType.Patch);
                request.body = { [lastSegment.relation.relationId]: request.body.id||request.body._id };
                this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
            }
            else if(request.type === ApiRequestType.Patch) {
                baseQuery = new ApiEdgeQuery(lastSegment.relation.to, ApiEdgeQueryType.Patch);
                this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
            }
            else {
                throw new ApiEdgeError(400, "Invalid Delete Query");
            }
        }
        else if(lastSegment instanceof MethodPathSegment) {
            ApiQueryBuilder.addMethodCallStep(request, query, lastSegment.method, lastSegment.edge);
            query.unshift(new ProvideIdQueryStep(lastSegment.edge.idField));
            readMode = false;
        }
        else {
            if(request.type === ApiRequestType.Update) {
                baseQuery = new ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType.Update);
                this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
            }
            else if(request.type === ApiRequestType.Patch) {
                baseQuery = new ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType.Patch);
                this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
            }
            else {
                baseQuery = new ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType.Delete);
                this.addQueryStep(query, new QueryEdgeQueryStep(baseQuery), null, true);
            }
        }

        //STEP 2: Provide context for the base query.
        query.unshift(new ExtendContextQueryStep(request.context));

        //STEP 3: Provide ID for the base query.
        if(lastSegment instanceof EntryPathSegment) {
            const _segment = lastSegment; //Add closure to make sure it won't be overridden later.
            query.unshift(new ExtendContextLiveQueryStep(context => context.id = _segment.id))
        }
        else if(lastSegment instanceof RelatedFieldPathSegment) {
            if(request.type === ApiRequestType.Update) {
                let previousSegment = segments[segments.length-2];
                query.unshift(new ProvideIdQueryStep(previousSegment.edge.idField||Api.defaultIdField));
                readMode = false; //Provide ID from the previous segment without querying the database.
            }
            else {
                query.unshift(new ProvideIdQueryStep(lastSegment.relation.relationId))
            }
        }
        else {
            //TODO: Add support for method calls with parameters
        }

        //STEP 4: Provide filters and validation for the base query.
        for(let i = segments.length-2; i >= 0; i--) {
            let currentSegment = segments[i];

            //STEP 1: Relate to the current query.
            let relation = segments[i+1].relation;
            let edge = segments[i+1].edge;
            if(relation && !(relation instanceof OneToOneRelation)) {
                if(edge === relation.to) {
                    query.unshift(new RelateBackwardsQueryStep(relation));
                }
                else {
                    query.unshift(new RelateQueryStep(relation));
                }

                if(request.type !== ApiRequestType.Delete) {
                    query.unshift(new RelateChangeQueryStep(relation));
                }
            }

            //STEP 2: Read or Check
            if(readMode) {
                readMode = this.buildReadStep(query, currentSegment)
            }
            else {
                readMode = this.buildCheckStep(query, currentSegment)
            }
        }

        //STEP 5: Provide body for the query
        if(request.body || request.stream)
            query.unshift(new SetBodyQueryStep(request.body, request.stream));

        //STEP 6: Add OnInput actions
        this.api.actions
            .filter((action: ApiAction) => action.triggerKind == ApiActionTriggerKind.OnInput)
            .forEach((action: ApiAction) => query.unshift(action));

        //STEP 7: Return the completed query.
        return query
    };

    private buildCreateQuery = (request: ApiRequest): ApiQuery => {
        let query = new ApiQuery();

        let segments = request.path.segments,
            lastSegment = segments[segments.length-1];

        //STEP 0: Create embed queries
        this.buildEmbedSteps(query, request, lastSegment);

        //STEP 1: Create the base query which will provide the final data.
        if(lastSegment instanceof MethodPathSegment) {
            ApiQueryBuilder.addMethodCallStep(request, query, lastSegment.method, lastSegment.edge);
        }
        else {
            this.addQueryStep(query, new QueryEdgeQueryStep(new ApiEdgeQuery(lastSegment.edge, ApiEdgeQueryType.Create)));
        }

        //STEP 2: Provide filters and validation for the base query.
        for(let i = segments.length-2; i >= 0; i--) {
            let currentSegment = segments[i];

            //STEP 1: Relate to the current query.
            let relation = segments[i+1].relation;
            if(relation && !(relation instanceof OneToOneRelation)) {
                query.unshift(new RelateChangeQueryStep(relation));
            }

            //STEP 2: Read or Check
            this.buildReadStep(query, currentSegment)
        }

        //STEP 3: Provide context for the base query.
        query.unshift(new SetBodyQueryStep(request.body, request.stream));

        //STEP 4: Add OnInput actions
        this.api.actions
            .filter((action: ApiAction) => action.triggerKind == ApiActionTriggerKind.OnInput)
            .forEach((action: ApiAction) => query.unshift(action));

        //STEP 5: Return the completed query.
        return query
    };


    build = (request: ApiRequest): ApiQuery => {
        switch(request.type) {
            case ApiRequestType.Read:
                return this.buildReadQuery(request);
            case ApiRequestType.Update:
            case ApiRequestType.Patch:
            case ApiRequestType.Delete:
                return this.buildChangeQuery(request);
            case ApiRequestType.Create:
                return this.buildCreateQuery(request);
            default:
                throw new ApiEdgeError(400, "Unsupported Query Type")
        }
    }
}