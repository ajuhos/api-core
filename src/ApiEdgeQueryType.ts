/**
 * Created by ajuhos on 2016. 10. 20..
 */

import {ApiEdgeDefinition} from './ApiEdgeDefinition';

export class ApiEdgeQuery {

    /**
     * The API edge to execute the query on.
     */
    edge: ApiEdgeDefinition;

    /**
     * The list of parameters to use during execution.
     */
    parameters: any[];

    /**
     * Create a new API Edge Query for the specified API Edge with the specified parameters.
     * @param {ApiEdgeDefinition} edge
     * @param {Array} parameters
     */
    constructor(type: ApiEdgeQueryType, edge: ApiEdgeDefinition, parameters: any[] = []) {
        this.edge = edge;
        this.parameters = parameters;
    }

}