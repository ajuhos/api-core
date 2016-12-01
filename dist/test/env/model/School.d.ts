import { Model } from "../edges/ModelEdge";
export interface SchoolScheme {
    id: string;
    name: string;
    address: string;
    phone: string;
}
export declare class School extends Model implements SchoolScheme {
    constructor(obj: SchoolScheme);
    static create(id: string, name: string, address: string, phone: string): School;
    id: string;
    name: string;
    address: string;
    phone: string;
}
