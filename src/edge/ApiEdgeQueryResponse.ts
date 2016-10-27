export class ApiEdgeQueryResponse {
    data: any;
    metadata: any;

    constructor(data: any, metadata: any = null) {
        this.data = data;
        this.metadata = metadata;
    }
}