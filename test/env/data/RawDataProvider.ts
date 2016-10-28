//import {StudentCourseConnection} from "../model/StudentCourseConnection";
import {Student} from "../model/Student";
import {School} from "../model/School";
import {CourseType} from "../model/CourseType";
import {Course} from "../model/Course";
import {Class} from "../model/Class";

export class RawDataProvider {

    static schools = [
        School.create("s1", "First School",  "16, Test street, North Pole, HA23535", "435234523"),
        School.create("s2", "Second School", "12, Test street, North Pole, HA23535", "456345283")
    ];

    static courseTypes = [
       CourseType.create("ct1", "Mathematics"),
       CourseType.create("ct2", "Science"),
       CourseType.create("ct3", "Sport"),
       CourseType.create("ct4", "English"),
       CourseType.create("ct5", "Biology")
    ];

    static courses = [
        Course.create("c1", "Maths A1",         "ct1", "c1"),
        Course.create("c2", "Advanced English", "ct4", ""),
        Course.create("c3", "English",          "ct4", "c2"),
        Course.create("c4", "Daily Sport",      "ct3", "c2"),
        Course.create("c5", "Biology A2",       "ct5", "c2"),
        Course.create("c6", "Science A1",       "ct3", "c1"),
    ];

    static classes = [
        Class.create("c1", "A", 1, "Room 1", "s1"),
        Class.create("c2", "A", 1, "Room 1", "s2"),
        Class.create("c3", "B", 1, "Room 2", "s2")
    ];

    static students = [
        Student.create("s1", "Peter", "Test", "peter.test@gmail.com", "123456789", "s1", "c1"),
        Student.create("s2", "Dave",  "Test", "dave.test@gmail.com",  "347633445", "s1", "c1"),
        Student.create("s3", "Gabe",  "Test", "gabe.test@gmail.com",  "453612674", "s2", "c2"),
        Student.create("s3", "Fred",  "Test", "fred.test@gmail.com",  "982364432", "s2", "c2"),
        Student.create("s4", "Kate",  "Test", "kate.test@gmail.com",  "645723475", "s2", "c3"),
        Student.create("s5", "Mark",  "Test", "mark.test@gmail.com",  "865232467", "s2", "c3"),
        Student.create("s6", "Anna",  "Test", "anna.test@gmail.com",  "234885357", "s1", "c3")
    ];

/*    static studentCourseConnections = [
        StudentCourseConnection.create("sc1", "c2", "s1"),
        StudentCourseConnection.create("sc2", "c2", "s3"),
        StudentCourseConnection.create("sc3", "c2", "s4"),
        StudentCourseConnection.create("sc4", "c2", "s5")
    ];*/

}