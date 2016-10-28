import { ModelEdge } from "./ModelEdge";
import { CourseType } from "../model/CourseType";
export declare class CourseTypeEdge extends ModelEdge<CourseType> {
    name: string;
    pluralName: string;
    provider: CourseType[];
    protected createModel: (obj: any) => CourseType;
}
