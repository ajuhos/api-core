import { ApiEdgeDefinition } from "../edge/ApiEdgeDefinition";
import { OneToManyRelation } from "../relations/OneToManyRelation";
import { OneToOneRelation } from "../relations/OneToOneRelation";
import { ApiEdgeQueryContext } from "../edge/ApiEdgeQueryContext";
export declare class PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToManyRelation | null;
    inspect: () => string;
}
export declare class EdgePathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToManyRelation | null;
    constructor(edge: ApiEdgeDefinition, relation: OneToManyRelation | null);
    inspect: () => string;
}
export declare class EntryPathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToManyRelation | null;
    id: string;
    constructor(edge: ApiEdgeDefinition, id: string, relation: OneToManyRelation | null);
    inspect: () => string;
}
export declare class RelatedFieldPathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToOneRelation;
    constructor(edge: ApiEdgeDefinition, relation: OneToOneRelation);
    inspect: () => string;
}
export declare class ApiRequestPath {
    segments: PathSegment[];
    add: (segment: PathSegment) => void;
    inspect: () => string;
}
export declare enum ApiRequestType {
    Create = 0,
    Read = 1,
    Update = 2,
    Delete = 3,
    Exists = 4,
}
export declare class ApiRequest {
    type: ApiRequestType;
    path: ApiRequestPath;
    context: ApiEdgeQueryContext;
    constructor();
}
