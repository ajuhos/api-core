import {ApiEdgeDefinition} from './ApiEdgeDefinition';
import {ApiEdgeQueryType} from './ApiEdgeQueryType';
import {ApiEdgeQueryContext} from "./ApiEdgeQueryContext";
import {ApiEdgeQueryResponse} from "./ApiEdgeQueryResponse";
import {ApiEdgeError} from "../query/ApiEdgeError";
import {ApiEdgeSchemaTransformation} from "./ApiEdgeSchema";

export class ApiEdgeQuery {

    /**
     * The API edge to execute the query on.
     */
    edge: ApiEdgeDefinition;

    /**
     * The type of query to execute.
     */
    type: ApiEdgeQueryType;

    /**
     * The list of parameters to use during execution.
     */
    context: ApiEdgeQueryContext;

    /**
     * The list of parameters to use during execution.
     */
    body: any;

    private originalFields: string[] = [];

    /**
     * Create a new API Edge Query for the specified API Edge with the specified parameters.
     * @param {ApiEdgeDefinition} edge
     * @param {ApiEdgeQueryType} type
     * @param {ApiEdgeQueryContext} context
     * @param {object} body
     */
    constructor(edge: ApiEdgeDefinition,
                type: ApiEdgeQueryType = ApiEdgeQueryType.Get,
                context: ApiEdgeQueryContext = new ApiEdgeQueryContext(),
                body: any = null) {
        this.edge = edge;
        this.type = type;
        this.context = context;
        this.body = body;

        switch (this.type) {
            case ApiEdgeQueryType.Get:
                if(!this.edge.allowGet) {
                    throw new ApiEdgeError(405, `Get queries not allowed on edge: ${this.edge.name}`)
                }
                break;
            case ApiEdgeQueryType.Exists:
                if(!this.edge.allowExists) {
                    throw new ApiEdgeError(405, `Exists queries not allowed on edge: ${this.edge.name}`)
                }
                break;
            case ApiEdgeQueryType.Create:
                if(!this.edge.allowCreate) {
                    throw new ApiEdgeError(405, `Create queries not allowed on edge: ${this.edge.name}`)
                }
                break;
            case ApiEdgeQueryType.Delete:
                if(!this.edge.allowRemove) {
                    throw new ApiEdgeError(405, `Delete queries not allowed on edge: ${this.edge.name}`)
                }
                break;
            case ApiEdgeQueryType.Update:
                if(!this.edge.allowUpdate) {
                    throw new ApiEdgeError(405, `Update queries not allowed on edge: ${this.edge.name}`)
                }
                break;
            case ApiEdgeQueryType.Patch:
                if(!this.edge.allowPatch) {
                    throw new ApiEdgeError(405, `Patch queries not allowed on edge: ${this.edge.name}`)
                }
                break;
            case ApiEdgeQueryType.List:
                if(!this.edge.allowList) {
                    throw new ApiEdgeError(405, `List queries not allowed on edge: ${this.edge.name}`)
                }
                break;
            default:
                throw new ApiEdgeError(405, "Unsupported Query Type")
        }
    }

    private applySchemaOnInputItem = (item: any) => {
        let output = {};
        this.edge.schema.transformations.forEach((transformation: ApiEdgeSchemaTransformation) => {
            if(transformation.parsedField(item) !== undefined)
                transformation.applyToInput(item, output)
        });

        return output
    };

    private applySchemaOnItem = (item: any): any => {
        let output = {};

        if(this.originalFields.length) {
            this.edge.schema.transformations.forEach((transformation: ApiEdgeSchemaTransformation) => {
                if(this.originalFields.indexOf(transformation.affectedSchemaField) != -1)
                    transformation.applyToOutput(item, output)
            });
        }
        else {
            this.edge.schema.transformations.forEach((transformation: ApiEdgeSchemaTransformation) => {
                transformation.applyToOutput(item, output)
            });
        }

        return output
    };

/*    private applyInputListSchema = (value: ApiEdgeQueryResponse) => {
        if(!this.edge.schema)
            return value;

        value.data = (value.data as any[]).map((item: any) => this.applySchemaOnInputItem(item));
        return value
    };*/

    private applyListSchema = (value: ApiEdgeQueryResponse) => {
        if(!this.edge.schema)
            return value;

        value.data = (value.data as any[]).map((item: any) => this.applySchemaOnItem(item));
        return value
    };

    private applyInputSchema = (value: any): any|Promise<any> => {
        if(!this.edge.schema)
            return value;

        return this.applySchemaOnInputItem(value)
    };

    private applySchema = (value: ApiEdgeQueryResponse): ApiEdgeQueryResponse|Promise<ApiEdgeQueryResponse> => {
        if(!this.edge.schema)
            return value;

        value.data = this.applySchemaOnItem(value.data);
        return value
    };

    execute = (): Promise<ApiEdgeQueryResponse> => {
        if(this.context.fields.length) {
            this.originalFields = this.context.fields;
            this.context.fields = this.edge.schema.transformFields(this.context.fields);
            this.context.filters.forEach(filter => filter.field = this.edge.schema.transformField(filter.field))
            //TODO: Support sort-by on renamed fields
        }

        if(this.body) {
            if(!this.context.id) this.context.id = this.body.id;

            if(this.edge.schema) {
                const result = this.edge.schema.cleanAndValidateModel(
                    this.body,
                    this.type === ApiEdgeQueryType.Patch
                );

                if(!result.valid) {
                    const errors = result.errors
                        ? result.errors.join(', ')
                        : '';
                    throw new ApiEdgeError(422, "Schema Validation Failed: " + errors)
                }
            }

            this.body = this.applyInputSchema(this.body);
        }

        switch (this.type) {
            case ApiEdgeQueryType.Get:
                return this.edge.getEntry(this.context).then(this.applySchema);
            case ApiEdgeQueryType.Exists:
                return this.edge.exists(this.context);
            case ApiEdgeQueryType.Create:
                return this.edge.createEntry(this.context, this.body).then(this.applySchema);
            case ApiEdgeQueryType.Delete:
                return this.edge.removeEntry(this.context, this.body).then(this.applySchema);
            case ApiEdgeQueryType.Update:
                return this.edge.updateEntry(this.context, this.body).then(this.applySchema);
            case ApiEdgeQueryType.Patch:
                return this.edge.patchEntry(this.context, this.body).then(this.applySchema);
            case ApiEdgeQueryType.List:
                return this.edge.listEntries(this.context).then(this.applyListSchema);
            default:
                throw new ApiEdgeError(500, "Unsupported Query Type")
        }
    }
}