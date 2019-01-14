const parse = require('obj-parse'),
    deepKeys = require('deep-keys'),
    SimpleSchema = require('simpl-schema').default;

export class Mixed {
    //for schemas
}

export const SchemaReference = SimpleSchema.oneOf(String, Mixed);
export const JSONDate = SimpleSchema.oneOf(String, Number, Date);


export class SubSchema extends SimpleSchema {
    private readonly _apiCoreOriginal: any;

    constructor(schema: any, options?: any, ...args: any[]) {
        if(!options) options = { requiredByDefault: false };
        super(schema, options, ...args);
        this._apiCoreOriginal = schema;
    }

    get original() {
        return this._apiCoreOriginal
    }
}

export class ApiEdgeSchemaTransformation {
    applyToInput: (schema: any, model: any) => void;
    applyToOutput: (mode: any, schema: any) => void;
    affectedSchemaField: string;
    affectedModelFields: string[];
    parsedField: any;

    constructor(input: (schema: any, model: any) => void,
                output: (model: any, schema: any) => void,
                modelFields: string[],
                schemaField: string = "") {
        this.applyToInput = input;
        this.applyToOutput = output;
        this.affectedSchemaField = schemaField;
        this.affectedModelFields = modelFields;
        this.parsedField = parse(schemaField);
    }

    setSchemaField(field: string) {
        this.affectedSchemaField = field;
        this.parsedField = parse(field);
    }
}

export class ApiEdgeSchema {
    fields: string[] = [];
    schema: any|null = null;
    originalSchema: any|null = null;
    transformations: ApiEdgeSchemaTransformation[];

    private fieldMatrix: { [key: string]: string[] } = {};
    private renameMatrix: { [key: string]: string } = {};
    transformField = (field: string) => {
        return this.renameMatrix[field] || field
    };

    transformFields = (fields: string[]): string[] => {
        let output: string[] = [];
        fields.forEach((field: string) => {
            const transformedFields = this.fieldMatrix[field];
            if(transformedFields) {
                transformedFields.forEach((f: string) => output.push(f))
            }
            else output.push(field)
        });
        return output
    };

    cleanAndValidateModel = (model: any, modifier: boolean = false): { valid: boolean, errors?: any[] } => {
        if(this.schema) {
            const context = this.schema.newContext();

            context.clean(model, {
                mutate: true,       //Update the original object
                filter: true,       //Remove not allowed fields
                autoConvert: true,  //Converts values when possible
                removeEmptyStrings: false,
                trimStrings: false,
                getAutoValues: true //Fill defaults
            });

            model = modifier
                ? { $set: model }
                : model;

            context.validate(model, { modifier });

            return {
                valid: context.isValid(),
                errors: context.validationErrors().map(
                    ({ name }: any) => context.keyErrorMessage(name)
                )
            }
        }

        return { valid: true }
    };

    private createInputTransformer(schemaField: any, transform: string): (schema: any, model: any) => void {
        if(transform === "=") {
            return (schema: any, model: any) => schemaField.assign(model, schemaField(schema));
        }
        else if(transform[0] === "=") {
            const fieldName = transform.substring(1),
                modelField = parse(fieldName);

            return (schema: any, model: any) => modelField.assign(model, schemaField(schema));
        }
        else throw "Not Supported Transform";
    }

    private static createOutputTransformer(schemaField: any, transform: string): (model: any, schema: any) => void {
        if(transform === "=") {
            return (model: any, schema: any) => schemaField.assign(schema, schemaField(model));
        }
        else if(transform[0] === "=") {
            const fieldName = transform.substring(1),
                modelField = parse(fieldName);

            return (model: any, schema: any) => schemaField.assign(schema, modelField(model));
        }
        else {
            throw "Not Supported Transform";
        }
    }

    private createTransformation(schemaField: string, schema: any): ApiEdgeSchemaTransformation|undefined {
        const parsedSchemaField = parse(schemaField),
            transform: string|ApiEdgeSchemaTransformation = parsedSchemaField(schema);

        if(transform instanceof ApiEdgeSchemaTransformation) {
            transform.setSchemaField(schemaField);

            let transformedFields = this.fieldMatrix[transform.affectedSchemaField];
            if(transformedFields) {
                transform.affectedModelFields.forEach((field: string) => transformedFields.push(field))
            }
            else {
                this.fieldMatrix[transform.affectedSchemaField]
                    = transform.affectedModelFields.map((field: string) => field)
            }

            this.fixFields(schemaField);

            return transform;
        }
        else if(typeof transform === "string") {
            this.renameMatrix[schemaField] = transform.substring(1);

            return new ApiEdgeSchemaTransformation(
                this.createInputTransformer(parsedSchemaField, transform),
                ApiEdgeSchema.createOutputTransformer(parsedSchemaField, transform),
                [ schemaField ],
                schemaField
            );
        }
    }

    private fixFields(fieldName: string) {
        this.fields = this.fields.filter((field: string) => field.indexOf(fieldName+".") == -1)
    }

    constructor(schema: any, typedSchema: any = null, fields?: string[]) {
        this.fields = fields || deepKeys(schema, true);
        this.originalSchema = typedSchema;
        this.schema = typedSchema
            ? new SimpleSchema(typedSchema, { requiredByDefault: false })
            : null;

        this.transformations = [];
        for(let i = 0; i < this.fields.length; ++i) {
            const transform = this.createTransformation(this.fields[i], schema);
            if(transform)
                this.transformations.push(transform)
        }
    }
}