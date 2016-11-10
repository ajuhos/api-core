const parse = require('obj-parse'),
    deepKeys = require('deep-keys');

export interface ApiEdgeSchemaTransformation {
    value: any;
    apply: Function;
}

export class ApiEdgeSchema {
    fields: string[];
    transformations: ApiEdgeSchemaTransformation[];

    private static createTransformer(transform: string|Function) {
        if(typeof transform === "function") return transform;
        else if(transform === "=") return (a: any) => a;
        else throw "Not Supported Transform"; //TODO
    }

    constructor(schema: any) {
        this.fields = deepKeys(schema);
        this.transformations = this.fields.map((field: string) => {
            const parsedField = parse(field);
            return {
                value: parsedField,
                apply: ApiEdgeSchema.createTransformer(parsedField(schema))
            }
        });
    }
}