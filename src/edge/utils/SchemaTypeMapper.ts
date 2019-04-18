import {Mixed, SchemaReference, SubSchema, JSONDate} from "../ApiEdgeSchema";

export class SchemaTypeMapper {
    private static mapField(field: any, typeMapper: (type: any) => any): any {
        if(Array.isArray(field)) {
            return [
                SchemaTypeMapper.mapField(field[0], typeMapper)
            ]
        }
        else if(field && typeof field == "object" && field.type) {
            return {
                ...field,
                type: typeMapper(field.type)
            }
        }
        else if(field instanceof SubSchema) {
            return typeMapper(field.original)
        }
        else {
            return typeMapper(field)
        }
    }

    private static mapSchemaFieldType(type: any): any {
        switch(type) {
            case Number:
                return 'number';
            case String:
                return 'string';
            case Boolean:
                return 'boolean';
            case SchemaReference:
                return 'reference';
            case JSONDate:
                return 'date';
            case Mixed:
                return 'any';
            case Object:
                return 'object';
            default:
                if(Array.isArray(type)) {
                    return [
                        SchemaTypeMapper.mapSchemaFieldType(type[0])
                    ]
                }
                else if(type && typeof type == "object") {
                    return SchemaTypeMapper.exportSchema(type)
                }
        }
    }

    private static mapFieldTypeSchema(type: any): any {
        switch(type) {
            case 'number':
                return Number;
            case 'string':
                return String;
            case 'boolean':
                return Boolean;
            case 'reference':
                return SchemaReference;
            case 'date':
                return JSONDate;
            case 'any':
                return Mixed;
            case 'object':
                return Object;
            default:
                if(Array.isArray(type)) {
                    return [
                        SchemaTypeMapper.mapFieldTypeSchema(type[0])
                    ]
                }
                else if(type && typeof type == "object") {
                    return new SubSchema(SchemaTypeMapper.importSchema(type))
                }
        }
    }

    static exportSchema(field: any): any {
        const output: { [key: string]: any } = {};
        Object
            .keys(field)
            .forEach(key =>
                output[key] = SchemaTypeMapper.mapField(field[key], SchemaTypeMapper.mapSchemaFieldType));

        return output
    }

    static importSchema(field: any): any {
        const output: { [key: string]: any } = {};
        Object
            .keys(field)
            .forEach(key =>
                output[key] = SchemaTypeMapper.mapField(field[key], SchemaTypeMapper.mapFieldTypeSchema));

        return output
    }
}