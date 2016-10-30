import {ApiEdgeDefinition} from './ApiEdgeDefinition';
import {ApiEdgeQueryType} from './ApiEdgeQueryType';
import {ApiEdgeQueryContext} from "./ApiEdgeQueryContext";
import {ApiEdgeQueryResponse} from "./ApiEdgeQueryResponse";
import {ApiEdgeError} from "../query/ApiEdgeError";

export class ApiEdgeQuery {

    /**
     * The API edge to execute the query on.
     */
    edge: ApiEdgeDefinition;

    /**
     * The type of query to execute.
     */
    type: ApiEdgeQueryType;

    /**
     * The list of parameters to use during execution.
     */
    context: ApiEdgeQueryContext;

    /**
     * The list of parameters to use during execution.
     */
    body: any;

    /**
     * Create a new API Edge Query for the specified API Edge with the specified parameters.
     * @param {ApiEdgeDefinition} edge
     * @param {ApiEdgeQueryType} type
     * @param {ApiEdgeQueryContext} context
     * @param {object} body
     */
    constructor(edge: ApiEdgeDefinition,
                type: ApiEdgeQueryType = ApiEdgeQueryType.Get,
                context: ApiEdgeQueryContext = new ApiEdgeQueryContext(),
                body: any = null) {
        this.edge = edge;
        this.type = type;
        this.context = context;
        this.body = body;
    }

    execute = (): Promise<ApiEdgeQueryResponse> => {
        switch (this.type) {
            case ApiEdgeQueryType.Get:
                return this.edge.getEntry(this.context);
            case ApiEdgeQueryType.Exists:
                return this.edge.exists(this.context);
            case ApiEdgeQueryType.Create:
                return this.edge.createEntry(this.context, this.body);
            case ApiEdgeQueryType.Delete:
                return this.edge.removeEntry(this.context, this.body);
            case ApiEdgeQueryType.Update:
                return this.edge.updateEntry(this.context, this.body);
            case ApiEdgeQueryType.Patch:
                return this.edge.patchEntry(this.context, this.body);
            case ApiEdgeQueryType.List:
                return this.edge.listEntries(this.context);
            default:
                throw new ApiEdgeError(500, "Unsupported Query Type")
        }
    }
}