import {Model} from "../edges/ModelEdge";
export class CourseTypeScheme {
    id: string;
    name: string;
}

export class CourseType extends Model implements CourseTypeScheme {
    constructor(obj: CourseTypeScheme) {
        super(obj);
        this.name = obj.name;
    }

    static create(
        id: string,
        name: string) {

        return new CourseType({ id, name });
    }


    id: string;
    name: string;
}
