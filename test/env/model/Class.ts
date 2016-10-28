import {Model} from "../edges/ModelEdge";
export interface ClassScheme {
    id: string;
    name: string;
    semester: number;
    room: string;
    schoolId: string;
}

export class Class extends Model implements ClassScheme {
    constructor(obj: ClassScheme) {
        super(obj);
        this.name = obj.name;
        this.semester = obj.semester;
        this.room = obj.room;
        this.schoolId = obj.schoolId;
    }

    static create(
        id: string,
        name: string,
        semester: number,
        room: string,
        schoolId: string) {

        return new Class({ id, name, semester, room, schoolId });
    }

    id: string;
    name: string;
    semester: number;
    room: string;
    schoolId: string;
}
