import {ApiEdgeQueryFilter, ApiEdgeQueryFilterType} from "./ApiEdgeQueryFilter";
import {OneToOneRelation} from "../relations/OneToOneRelation";

export class ApiEdgeQueryContext {
    id: string|null;
    fields: string[] = [];
    populatedRelations: OneToOneRelation[] = [];
    pagination: {
        skip: number,
        limit: number
    };
    sortBy: any[] = [];
    filters: ApiEdgeQueryFilter[] = [];

    clone = () => {
        let temp = new ApiEdgeQueryContext();
        temp.id = this.id;

        this.fields.forEach(f => temp.fields.push(f));
        this.populatedRelations.forEach(f => temp.populatedRelations.push(f));
        this.filters.forEach(f => temp.filters.push(f.clone()));
        this.sortBy.forEach(f => temp.sortBy.push([f[0], f[1]]));

        if(this.pagination) {
            temp.pagination = {
                skip: this.pagination.skip,
                limit: this.pagination.limit
            }
        }

        return temp;
    };

    constructor(id: string|null = null, fields: string[] = []) {
        this.id = id;
        this.fields = fields;
    }

    paginate = (skip: number, limit: number) => {
        this.pagination = {
            skip, limit
        };
        return this
    };

    sort = (fieldName: string, ascending: boolean = true) => {
        this.sortBy.push([fieldName, (ascending ? 1 : -1)]);
        return this
    };

    populate(relation: OneToOneRelation) {
        this.populatedRelations.push(relation);
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