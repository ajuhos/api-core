import { Student } from "../model/Student";
import { School } from "../model/School";
import { CourseType } from "../model/CourseType";
import { Course } from "../model/Course";
import { Class } from "../model/Class";
export declare class RawDataProvider {
    static schools: School[];
    static courseTypes: CourseType[];
    static courses: Course[];
    static classes: Class[];
    static students: Student[];
}
