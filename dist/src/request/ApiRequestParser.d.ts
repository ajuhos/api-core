import { ApiRequestPath, ApiRequest } from "./ApiRequest";
import { Api } from "../Api";
export declare class ApiRequestPathParser {
    api: Api;
    constructor(api: Api);
    private findEdgeByName(name);
    private findRelationByName(edge, name);
    private findMethodByName(edge, name, forEntry);
    parse(segments: string[]): ApiRequestPath;
}
export declare class ApiRequestParser {
    api: Api;
    private pathParser;
    constructor(api: Api);
    parse(segments: string[]): ApiRequest;
}
