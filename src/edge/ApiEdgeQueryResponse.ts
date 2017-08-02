export class ApiEdgeQueryResponse {
    data: any;
    metadata: any;

    constructor(data: any, metadata: any = null) {
        this.data = data;
        this.metadata = metadata;
    }
}

export class ApiEdgeQueryStreamResponse extends ApiEdgeQueryResponse {
    stream: NodeJS.ReadableStream;

    constructor(stream: NodeJS.ReadableStream, metadata: any = null) {
        super(null, metadata);
        this.stream = stream
    }
}