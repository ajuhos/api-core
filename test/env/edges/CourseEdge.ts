import {RawDataProvider} from "../data/RawDataProvider";
import {ModelEdge} from "./ModelEdge";
import {Course} from "../model/Course";

export class CourseEdge extends ModelEdge<Course> {
    name = "course";
    pluralName = "courses";

    provider = RawDataProvider.courses;
    protected createModel = (obj: any) => new Course(obj);
}
