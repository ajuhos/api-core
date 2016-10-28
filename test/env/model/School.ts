import {Model} from "../edges/ModelEdge";
export interface SchoolScheme {
    id: string;
    name: string;
    address: string;
    phone: string;
}

export class School extends Model implements SchoolScheme {

    constructor(obj: SchoolScheme) {
        super(obj);
        this.name = obj.name;
        this.address = obj.address;
        this.phone = obj.phone;
    }

    static create(
        id: string,
        name: string,
        address: string,
        phone: string) {

        return new School({ id, name, address, phone});
    }

    id: string;
    name: string;
    address: string;
    phone: string;
}
