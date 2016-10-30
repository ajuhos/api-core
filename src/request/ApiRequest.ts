import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {OneToManyRelation} from "../relations/OneToManyRelation";
import {OneToOneRelation} from "../relations/OneToOneRelation";
import {ApiEdgeQueryContext} from "../edge/ApiEdgeQueryContext";
import {ApiEdgeMethod} from "../edge/ApiEdgeMethod";

export class PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToManyRelation|null;

    inspect = () => {
        return '';
    }
}

export class MethodPathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    method: ApiEdgeMethod;

    constructor(edge: ApiEdgeDefinition, method: ApiEdgeMethod) {
        super();
        this.edge = edge;
        this.method = method;
    }

    inspect = () => {
        return `call{${this.method.name}}`;
    }
}

export class EdgePathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToManyRelation|null;

    constructor(edge: ApiEdgeDefinition, relation: OneToManyRelation|null) {
        super();
        this.edge = edge;
        this.relation = relation;
    }

    inspect = () => {
        return `[${this.edge.name}]`;
    }
}

export class EntryPathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToManyRelation|null;
    id: string;

    constructor(edge: ApiEdgeDefinition, id: string, relation: OneToManyRelation|null) {
        super();
        this.edge = edge;
        this.relation = relation;
        this.id = id;
    }

    inspect = () => {
        return `${this.edge.name}(${this.id})`;
    }
}

export class RelatedFieldPathSegment extends PathSegment {
    edge: ApiEdgeDefinition;
    relation: OneToOneRelation;

    constructor(edge: ApiEdgeDefinition, relation: OneToOneRelation) {
        super();
        this.edge = edge;
        this.relation = relation;
    }

    inspect = () => {
        return `${this.edge.name}.${this.relation.name}`;
    }
}

export class ApiRequestPath {
    segments: PathSegment[] = [];

    add = (segment: PathSegment) => {
        this.segments.push(segment);
    };

    inspect = () => {
        return this.segments.map(segment => segment.inspect()).join(' -> ');
    }
}

export enum ApiRequestType {
    Create = 1 << 0,
    Read   = 1 << 1,
    Update = 1 << 2,
    Patch  = 1 << 3,
    Delete = 1 << 4,
    Exists = 1 << 5,

    Any = Create | Read | Update | Patch | Delete | Exists,
    Change = Update | Patch
}

export class ApiRequest {
    type: ApiRequestType;
    path: ApiRequestPath;
    body: any|null = null; //Should be request context
    context: ApiEdgeQueryContext; //Should be request context

    constructor() {
        this.path = new ApiRequestPath();
        this.type = ApiRequestType.Read;
        this.context = new ApiEdgeQueryContext();
    }
}