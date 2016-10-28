import {Model} from "../edges/ModelEdge";
export interface CourseScheme {
    id: string;
    name: string;
    classId: string;
    courseTypeId: string;
}

export class Course extends Model implements CourseScheme{
    constructor(obj: CourseScheme) {
        super(obj);
        this.name = obj.name;
        this.courseTypeId = obj.courseTypeId;
        this.classId = obj.classId;
    }

    static create(
        id: string,
        name: string,
        courseTypeId: string,
        classId: string) {

        return new Course({ id, name, courseTypeId, classId });
    }

    id: string;
    name: string;
    classId: string;
    courseTypeId: string;
}
