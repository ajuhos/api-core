import { Student } from "../model/Student";
import { ModelEdge } from "./ModelEdge";
export declare class StudentEdge extends ModelEdge<Student> {
    name: string;
    pluralName: string;
    provider: Student[];
    protected createModel: (obj: any) => Student;
    constructor();
}
