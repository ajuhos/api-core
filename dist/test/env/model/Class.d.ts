import { Model } from "../edges/ModelEdge";
export interface ClassScheme {
    id: string;
    name: string;
    semester: number;
    room: string;
    schoolId: string;
}
export declare class Class extends Model implements ClassScheme {
    constructor(obj: ClassScheme);
    static create(id: string, name: string, semester: number, room: string, schoolId: string): Class;
    id: string;
    name: string;
    semester: number;
    room: string;
    schoolId: string;
}
