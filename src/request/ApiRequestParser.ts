import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {ApiEdgeRelation} from "../relations/ApiEdgeRelation";
import {
    ApiRequestPath, RelatedFieldPathSegment, EntryPathSegment, EdgePathSegment, ApiRequest,
    MethodPathSegment
} from "./ApiRequest";
import {OneToOneRelation} from "../relations/OneToOneRelation";
import {OneToManyRelation} from "../relations/OneToManyRelation";
import {ApiEdgeError} from "../query/ApiEdgeError";
import {Api} from "../Api";
import {ApiEdgeMethod, ApiEdgeMethodScope} from "../edge/ApiEdgeMethod";

export class ApiRequestPathParser {
    api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    private findEdgeByName(name: string) {
        return this.api.findEdge(name);
    }

    private findRelationByName(edge: ApiEdgeDefinition, name: string) {
        return this.api.findRelationOfEdge(edge, name)
    }

    private findMethodByName(edge: ApiEdgeDefinition,
                             name: string|null|undefined,
                             forEntry: boolean): ApiEdgeMethod|undefined {
        if(forEntry) {
            return edge.methods.find((method: ApiEdgeMethod) =>
                method.name === name &&
                (method.scope == ApiEdgeMethodScope.Entry || method.scope == ApiEdgeMethodScope.Edge));
        }
        else {
            return edge.methods.find((method: ApiEdgeMethod) =>
                method.name === name &&
                (method.scope == ApiEdgeMethodScope.Collection || method.scope == ApiEdgeMethodScope.Edge));
        }
    }

    async parse(segments: string[]): Promise<ApiRequestPath> {
        let requestPath = new ApiRequestPath();

        let lastEdge: ApiEdgeDefinition|null = null,
            lastRelation: ApiEdgeRelation|null = null,
            wasEntry = false;
        while(segments.length) {
            let segment = segments.shift() || '';

            if(lastEdge) {
                let relation: ApiEdgeRelation|undefined = await this.findRelationByName(lastEdge, segment);
                if(relation) {
                    if(relation instanceof OneToOneRelation) {
                        requestPath.add(new RelatedFieldPathSegment(lastEdge, relation));
                        lastEdge = (relation as OneToOneRelation).to;
                        lastRelation = relation;
                        wasEntry = true;
                    }
                    else if(wasEntry && relation instanceof OneToManyRelation) {
                        lastEdge = (relation as OneToManyRelation).to;
                        lastRelation = relation;
                        wasEntry = false;
                    }
                    else {
                        throw new ApiEdgeError(400, "Unsupported Relation: " + segment);
                    }
                }
                else {
                    let method: ApiEdgeMethod|undefined = this.findMethodByName(lastEdge, segment, wasEntry);

                    if(method) {
                        //TODO: Add support for method parameters
                        requestPath.add(new MethodPathSegment(lastEdge, method));
                        wasEntry = true;
                    }
                    else if (!wasEntry) {
                        requestPath.add(new EntryPathSegment(lastEdge, "" + segment, lastRelation));
                        wasEntry = true;
                    }
                    else {
                        throw new ApiEdgeError(400, `Missing Relation/Method: ${lastEdge.name} -> ${segment}`);
                    }
                }
            }
            else {
                let edge = await this.findEdgeByName(segment);

                if(edge) {
                    lastEdge = edge;
                    wasEntry = false;
                }
                else {
                    throw new ApiEdgeError(400,"Missing Edge: " + segment);
                }
            }
        }

        if(lastEdge && !wasEntry) {
            requestPath.add(new EdgePathSegment(lastEdge, lastRelation));
            lastEdge = null;
        }

        return requestPath
    }

}

export class ApiRequestParser {
    api: Api;
    private pathParser: ApiRequestPathParser;

    constructor(api: Api) {
        this.api = api;
        this.pathParser = new ApiRequestPathParser(api);
    }

    async parse(segments: string[]): Promise<ApiRequest> {
        let request = new ApiRequest(this.api);
        request.path = await this.pathParser.parse(segments);
        return request;
    }
}
