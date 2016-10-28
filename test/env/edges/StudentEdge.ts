import {RawDataProvider} from "../data/RawDataProvider";
import {Student} from "../model/Student";
import {ModelEdge} from "./ModelEdge";

export class StudentEdge extends ModelEdge<Student> {
    name = "student";
    pluralName = "students";

    provider = RawDataProvider.students;
    protected createModel = (obj: any): Student => new Student(obj);
}
