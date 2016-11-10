import { Student } from "../model/Student";
import { ModelEdge } from "./ModelEdge";
import { ApiEdgeSchema } from "../../../src/edge/ApiEdgeSchema";
export declare class StudentEdge extends ModelEdge<Student> {
    name: string;
    pluralName: string;
    schema: ApiEdgeSchema;
    provider: Student[];
    protected createModel: (obj: any) => Student;
    constructor();
}
