"use strict";
var parse = require('obj-parse'), deepKeys = require('deep-keys');
var ApiEdgeSchemaTransformation = (function () {
    function ApiEdgeSchemaTransformation(input, output, modelFields, schemaField) {
        if (schemaField === void 0) { schemaField = ""; }
        this.applyToInput = input;
        this.applyToOutput = output;
        this.affectedSchemaField = schemaField;
        this.affectedModelFields = modelFields;
        this.parsedField = parse(schemaField);
    }
    return ApiEdgeSchemaTransformation;
}());
exports.ApiEdgeSchemaTransformation = ApiEdgeSchemaTransformation;
var ApiEdgeSchema = (function () {
    function ApiEdgeSchema(schema) {
        var _this = this;
        this.fieldMatrix = {};
        this.transformFields = function (fields) {
            var output = [];
            fields.forEach(function (field) {
                var transformedFields = _this.fieldMatrix[field];
                if (transformedFields) {
                    transformedFields.forEach(function (f) { return output.push(f); });
                }
                else
                    output.push(field);
            });
            return output;
        };
        this.fields = deepKeys(schema, true);
        this.transformations = [];
        for (var i = 0; i < this.fields.length; ++i) {
            var transform = this.createTransformation(this.fields[i], schema);
            if (transform)
                this.transformations.push(transform);
        }
    }
    ApiEdgeSchema.createInputTransformer = function (schemaField, transform) {
        if (transform === "=") {
            return function (schema, model) { return schemaField.assign(model, schemaField(schema)); };
        }
        else if (transform[0] === "=") {
            var fieldName = transform.substring(1), modelField_1 = parse(fieldName);
            return function (model, schema) { return modelField_1.assign(model, schemaField(schema)); };
        }
        else
            throw "Not Supported Transform";
    };
    ApiEdgeSchema.createOutputTransformer = function (schemaField, transform) {
        if (transform === "=") {
            return function (model, schema) { return schemaField.assign(schema, schemaField(model)); };
        }
        else if (transform[0] === "=") {
            var fieldName = transform.substring(1), modelField_2 = parse(fieldName);
            return function (model, schema) { return schemaField.assign(schema, modelField_2(model)); };
        }
        else {
            throw "Not Supported Transform";
        }
    };
    ApiEdgeSchema.prototype.createTransformation = function (schemaField, schema) {
        var parsedSchemaField = parse(schemaField), transform = parsedSchemaField(schema);
        if (transform instanceof ApiEdgeSchemaTransformation) {
            transform.affectedSchemaField = schemaField;
            var transformedFields_1 = this.fieldMatrix[transform.affectedSchemaField];
            if (transformedFields_1) {
                transform.affectedModelFields.forEach(function (field) { return transformedFields_1.push(field); });
            }
            else {
                this.fieldMatrix[transform.affectedSchemaField]
                    = transform.affectedModelFields.map(function (field) { return field; });
            }
            this.fixFields(schemaField);
            return transform;
        }
        else if (typeof transform === "string") {
            return new ApiEdgeSchemaTransformation(ApiEdgeSchema.createInputTransformer(parsedSchemaField, transform), ApiEdgeSchema.createOutputTransformer(parsedSchemaField, transform), [schemaField], schemaField);
        }
    };
    ApiEdgeSchema.prototype.fixFields = function (fieldName) {
        this.fields = this.fields.filter(function (field) { return field.indexOf(fieldName + ".") == -1; });
    };
    return ApiEdgeSchema;
}());
exports.ApiEdgeSchema = ApiEdgeSchema;
//# sourceMappingURL=ApiEdgeSchema.js.map