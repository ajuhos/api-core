import { Model } from "../edges/ModelEdge";
export interface StudentScheme {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    schoolId: string;
    classId: string;
}
export declare class Student extends Model implements StudentScheme {
    constructor(obj: StudentScheme);
    static create(id: string, firstName: string, lastName: string, email: string, phone: string, schoolId: string, classId: string): Student;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    schoolId: string;
    classId: string;
}
