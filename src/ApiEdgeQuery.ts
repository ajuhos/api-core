/**
 * Created by ajuhos on 2016. 10. 20..
 */

import {ApiEdgeDefinition} from './ApiEdgeDefinition';
import {ApiEdgeQueryType} from './ApiEdgeQueryType';

class QueryContext {
    id: string;

    constructor(parameters: any[]) {
        parameters.forEach(param => {
            if(param.id) this.id = param.id;
        })
    }
}

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
    parameters: any[];

    /**
     * Create a new API Edge Query for the specified API Edge with the specified parameters.
     * @param {ApiEdgeDefinition} edge
     * @param {ApiEdgeQueryType} type
     * @param {Array} parameters
     */
    constructor(edge: ApiEdgeDefinition,
                type: ApiEdgeQueryType = ApiEdgeQueryType.Get,
                ...parameters: any[]) {
        this.edge = edge;
        this.type = type;
        this.parameters = parameters;
    }

    execute = () => {
        const context = new QueryContext(this.parameters);
        switch (this.type) {
            case ApiEdgeQueryType.Get:
                return this.edge.getEntry(context.id);
            case ApiEdgeQueryType.Exists:
                return this.edge.exists(context.id);
            case ApiEdgeQueryType.Create:
                //TODO
                break;
            case ApiEdgeQueryType.Delete:
                //TODO
                break;
            case ApiEdgeQueryType.Update:
                //TODO
                break;
            case ApiEdgeQueryType.List:
                //TODO
                break;
            case ApiEdgeQueryType.Call:
                //TODO
                break;
        }
    }
}