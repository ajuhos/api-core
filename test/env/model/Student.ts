import {Model} from "../edges/ModelEdge";
export interface StudentScheme {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    schoolId: string;
    classId: string;
}

export class Student extends Model implements StudentScheme{

    constructor(obj: StudentScheme) {
        super(obj);
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        this.email = obj.email;
        this.phone = obj.phone;
        this.schoolId = obj.schoolId;
        this.classId = obj.classId;
    }

    static create(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        phone: string,
        schoolId: string,
        classId: string) {

        return new Student({ id, firstName, lastName, email, phone, schoolId, classId });
    }

    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    schoolId: string;
    classId: string;
}
