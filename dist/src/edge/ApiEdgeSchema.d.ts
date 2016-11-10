export interface ApiEdgeSchemaTransformation {
    value: any;
    apply: Function;
}
export declare class ApiEdgeSchema {
    fields: string[];
    transformations: ApiEdgeSchemaTransformation[];
    private static createTransformer(transform);
    constructor(schema: any);
}
