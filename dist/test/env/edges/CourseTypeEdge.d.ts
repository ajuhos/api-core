import { ModelEdge } from "./ModelEdge";
import { CourseType } from "../model/CourseType";
import { ApiEdgeSchema } from "../../../src/edge/ApiEdgeSchema";
export declare class CourseTypeEdge extends ModelEdge<CourseType> {
    name: string;
    pluralName: string;
    schema: ApiEdgeSchema;
    provider: CourseType[];
    protected createModel: (obj: any) => CourseType;
}
