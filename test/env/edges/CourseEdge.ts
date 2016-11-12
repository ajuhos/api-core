import {RawDataProvider} from "../data/RawDataProvider";
import {ModelEdge} from "./ModelEdge";
import {Course} from "../model/Course";
import {ApiEdgeSchema} from "../../../src/edge/ApiEdgeSchema";

export class CourseEdge extends ModelEdge<Course> {
    name = "course";
    pluralName = "courses";

    schema = new ApiEdgeSchema({
        id: "=",
        name: "=",
        classId: "=",
        courseTypeId: "="
    });

    provider = RawDataProvider.courses;
    protected createModel = (obj: any) => new Course(obj);
}
