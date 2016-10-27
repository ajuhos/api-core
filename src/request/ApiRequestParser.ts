import {ApiEdgeDefinition} from "../edge/ApiEdgeDefinition";
import {ApiEdgeRelation} from "../relations/ApiEdgeRelation";
import {ApiRequestPath, RelatedFieldPathSegment, EntryPathSegment, EdgePathSegment, ApiRequest} from "./ApiRequest";
import {OneToOneRelation} from "../relations/OneToOneRelation";
import {OneToManyRelation} from "../relations/OneToManyRelation";
import {ApiEdgeError} from "../query/ApiEdgeError";
import {Api} from "../Api";

export class ApiRequestPathParser {
    api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    private findEdgeByName(name: string|null|undefined): ApiEdgeDefinition {
        return this.api.edges.find((edge: ApiEdgeDefinition) => edge.pluralName === name);
    }

    private findRelationByName(edge: ApiEdgeDefinition, name: string|null|undefined): ApiEdgeRelation {
        return edge.relations.find((rel: ApiEdgeRelation) => rel.name === name);
    }

    parse(segments: string[]): ApiRequestPath {
        let requestPath = new ApiRequestPath();

        let lastEdge: ApiEdgeDefinition|null = null,
            lastRelation: ApiEdgeRelation|null = null,
            wasEntry = false;
        while(segments.length) {
            let segment = segments.shift();

            if(lastEdge) {
                //TODO: Add support for methods.

                let relation: ApiEdgeRelation = this.findRelationByName(lastEdge, segment);
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
                else if(!wasEntry) {
                    requestPath.add(new EntryPathSegment(lastEdge, ""+segment, lastRelation));
                    wasEntry = true;
                }
                else {
                    throw new ApiEdgeError(400, `Missing Relation: ${lastEdge.name} -> ${segment}`);
                }
            }
            else {
                let edge = this.findEdgeByName(segment);

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

    parse(segments: string[]): ApiRequest {
        let request = new ApiRequest();
        request.path = this.pathParser.parse(segments);
        return request;
    }
}
