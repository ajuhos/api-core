import {ApiEdgeQueryFilter, ApiEdgeQueryFilterType} from "./ApiEdgeQueryFilter";

export class ApiEdgeQueryContext {
    id: string;
    fields: string[] = [];
    populatedFields: string[] = [];
    pagination: {
        skip: number,
        limit: number
    };
    filters: ApiEdgeQueryFilter[] = [];

    clone = () => {
        let temp = new ApiEdgeQueryContext();
        temp.id = this.id;

        this.fields.forEach(f => temp.fields.push(f));
        this.populatedFields.forEach(f => temp.populatedFields.push(f));
        this.filters.forEach(f => temp.filters.push(f.clone()));

        if(this.pagination) {
            temp.pagination = {
                skip: this.pagination.skip,
                limit: this.pagination.limit
            }
        }

        return temp;
    };

    constructor(id: string = null, fields: string[] = []) {
        this.id = id;
        this.fields = fields;
    }

    paginate = (skip, limit) => {
        this.pagination = {
            skip, limit
        };
        return this
    };

    populate(field: string) {
        this.populatedFields.push(field);
        return this
    }

    field(field: string) {
        this.fields.push(field);
        return this
    }

    filter(field: string, type: ApiEdgeQueryFilterType, value: any) {
        this.filters.push(new ApiEdgeQueryFilter(field, type, value));
        return this
    }
}