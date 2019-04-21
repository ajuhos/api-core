import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {ApiEdgeRelation} from "../relations/ApiEdgeRelation";

export interface ApiResolver {
    resolveEdge(name: string, plural: boolean): Promise<ApiEdgeDefinition|undefined>
    resolveRelation(name: string): Promise<ApiEdgeRelation|undefined>
    resolveRelationOfEdge(edge: string, name: string): Promise<ApiEdgeRelation|undefined>
    resolveRelationTo(edge: string, name: string): Promise<ApiEdgeRelation|undefined>
    resolveRelationFrom(edge: string, name: string): Promise<ApiEdgeRelation|undefined>

    resolveEdgeLazy(name: string, plural: boolean): ApiEdgeDefinition
}