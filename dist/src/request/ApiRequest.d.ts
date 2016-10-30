import { ApiEdgeDefinition } from "../edge/ApiEdgeDefinition";
import { OneToManyRelation } from "../relations/OneToManyRelation";
import { OneToOneRelation } from "../relations/OneToOneRelation";
import { ApiEdgeQueryContext } from "../edge/ApiEdgeQueryContext";
import { ApiEdgeMethod } from "../edge/ApiEdgeMethod";
export declare class PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToManyRelation | null;
    inspect: () => string;
}
export declare class MethodPathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    method: ApiEdgeMethod;
    constructor(edge: ApiEdgeDefinition, method: ApiEdgeMethod);
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
    Create = 1,
    Read = 2,
    Update = 4,
    Patch = 8,
    Delete = 16,
    Exists = 32,
    Any = 63,
    Change = 13,
}
export declare class ApiRequest {
    type: ApiRequestType;
    path: ApiRequestPath;
    body: any | null;
    context: ApiEdgeQueryContext;
    constructor();
}
