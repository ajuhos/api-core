const parse = require('obj-parse'),
    deepKeys = require('deep-keys');

export class ApiEdgeSchema {
    fields: string[];
    transformations: any;

    constructor(schema: any) {
        this.fields = deepKeys(schema);
        this.transformations = {};

        this.fields.forEach((field: string) => this.transformations[field] = parse(field)(schema));
    }
}