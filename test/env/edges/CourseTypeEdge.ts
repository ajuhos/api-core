import {RawDataProvider} from "../data/RawDataProvider";
import {ModelEdge} from "./ModelEdge";
import {CourseType} from "../model/CourseType";
import {ApiEdgeSchema} from "../../../src/edge/ApiEdgeSchema";

export class CourseTypeEdge extends ModelEdge<CourseType> {
    name = "courseType";
    pluralName = "courseTypes";

    schema = new ApiEdgeSchema({
        id: "=",
        name: "="
    });

    provider = RawDataProvider.courseTypes;
    protected createModel = (obj: any) => new CourseType(obj);
}
