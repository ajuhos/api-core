import { ModelEdge } from "./ModelEdge";
import { Course } from "../model/Course";
export declare class CourseEdge extends ModelEdge<Course> {
    name: string;
    pluralName: string;
    provider: Course[];
    protected createModel: (obj: any) => Course;
}
