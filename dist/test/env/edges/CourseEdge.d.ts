import { ModelEdge } from "./ModelEdge";
import { Course } from "../model/Course";
import { ApiEdgeSchema } from "../../../src/edge/ApiEdgeSchema";
export declare class CourseEdge extends ModelEdge<Course> {
    name: string;
    pluralName: string;
    schema: ApiEdgeSchema;
    provider: Course[];
    protected createModel: (obj: any) => Course;
}
