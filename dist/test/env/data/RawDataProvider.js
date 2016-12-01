"use strict";
var Student_1 = require("../model/Student");
var School_1 = require("../model/School");
var CourseType_1 = require("../model/CourseType");
var Course_1 = require("../model/Course");
var Class_1 = require("../model/Class");
var RawDataProvider = (function () {
    function RawDataProvider() {
    }
    RawDataProvider.schools = [
        School_1.School.create("s1", "First School", "16, Test street, North Pole, HA23535", "435234523"),
        School_1.School.create("s2", "Second School", "12, Test street, North Pole, HA23535", "456345283")
    ];
    RawDataProvider.courseTypes = [
        CourseType_1.CourseType.create("ct1", "Mathematics"),
        CourseType_1.CourseType.create("ct2", "Science"),
        CourseType_1.CourseType.create("ct3", "Sport"),
        CourseType_1.CourseType.create("ct4", "English"),
        CourseType_1.CourseType.create("ct5", "Biology")
    ];
    RawDataProvider.courses = [
        Course_1.Course.create("c1", "Maths A1", "ct1", "c1"),
        Course_1.Course.create("c2", "Advanced English", "ct4", ""),
        Course_1.Course.create("c3", "English", "ct4", "c2"),
        Course_1.Course.create("c4", "Daily Sport", "ct3", "c2"),
        Course_1.Course.create("c5", "Biology A2", "ct5", "c2"),
        Course_1.Course.create("c6", "Science A1", "ct3", "c1"),
    ];
    RawDataProvider.classes = [
        Class_1.Class.create("c1", "A", 1, "Room 1", "s1"),
        Class_1.Class.create("c2", "A", 1, "Room 1", "s2"),
        Class_1.Class.create("c3", "B", 1, "Room 2", "s2")
    ];
    RawDataProvider.students = [
        Student_1.Student.create("s1", "Peter", "Test", "peter.test@gmail.com", "123456789", "s1", "c1"),
        Student_1.Student.create("s2", "Dave", "Test", "dave.test@gmail.com", "347633445", "s1", "c1"),
        Student_1.Student.create("s3", "Gabe", "Test", "gabe.test@gmail.com", "453612674", "s2", "c2"),
        Student_1.Student.create("s3", "Fred", "Test", "fred.test@gmail.com", "982364432", "s2", "c2"),
        Student_1.Student.create("s4", "Kate", "Test", "kate.test@gmail.com", "645723475", "s2", "c3"),
        Student_1.Student.create("s5", "Mark", "Test", "mark.test@gmail.com", "865232467", "s2", "c3"),
        Student_1.Student.create("s6", "Anna", "Test", "anna.test@gmail.com", "234885357", "s1", "c3")
    ];
    return RawDataProvider;
}());
exports.RawDataProvider = RawDataProvider;
//# sourceMappingURL=RawDataProvider.js.map