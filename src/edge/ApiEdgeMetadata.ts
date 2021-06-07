import {ApiRequestType} from "../request/ApiRequest";

export interface ApiEdgeMetadata {
    name: string;
    pluralName: string;
    idField: string;
    fields: string[];
    methods: { name: string, type: ApiRequestType, parameters: string[] }[];
    typings?: { [key: string]: any };
    allowGet: boolean;
    allowList: boolean;
    allowCreate: boolean;
    allowUpdate: boolean;
    allowPatch: boolean;
    allowRemove: boolean;
    allowExists: boolean;
    external: boolean;
}
