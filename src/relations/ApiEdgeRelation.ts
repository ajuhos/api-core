import {ApiEdgeQuery} from "../ApiEdgeQuery";

export interface ApiEdgeRelation {
    name: string;
    relationId: string;
    query: (relatedId: string, queryItems: string[]) => ApiEdgeQuery;
}