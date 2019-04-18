export interface ExportedApiEdgeQueryParameter {
    key: string
    value: any
}

export class ApiEdgeQueryParameter {
    key: string;
    value: any;

    constructor(key: string, value: any) {
        this.key = key;
        this.value = value
    }

    clone = () => new ApiEdgeQueryParameter(this.key, this.value);
}