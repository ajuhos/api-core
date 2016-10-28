import {RawDataProvider} from "../data/RawDataProvider";
import {ModelEdge} from "./ModelEdge";
import {CourseType} from "../model/CourseType";

export class CourseTypeEdge extends ModelEdge<CourseType> {
    name = "courseType";
    pluralName = "courseTypes";

    provider = RawDataProvider.courseTypes;
    protected createModel = (obj: any) => new CourseType(obj);
}
