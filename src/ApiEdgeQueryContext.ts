export class ApiEdgeQueryContext {
    id: string;
    fields: string[] = [];
    populatedFields: string[];
    pagination: {
        skip: number,
        limit: number
    };
    filters: any[] = [];

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

    filter(filter: string) {
        this.filters.push(filter);
        return this
    }
}