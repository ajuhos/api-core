import { Model } from "../edges/ModelEdge";
export interface CourseScheme {
    id: string;
    name: string;
    classId: string;
    courseTypeId: string;
}
export declare class Course extends Model implements CourseScheme {
    constructor(obj: CourseScheme);
    static create(id: string, name: string, courseTypeId: string, classId: string): Course;
    id: string;
    name: string;
    classId: string;
    courseTypeId: string;
}
