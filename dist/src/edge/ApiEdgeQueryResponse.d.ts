/// <reference types="node" />
export declare class ApiEdgeQueryResponse {
    data: any;
    metadata: any;
    constructor(data: any, metadata?: any);
}
export declare class ApiEdgeQueryStreamResponse extends ApiEdgeQueryResponse {
    stream: NodeJS.ReadableStream;
    constructor(stream: NodeJS.ReadableStream, metadata?: any);
}
