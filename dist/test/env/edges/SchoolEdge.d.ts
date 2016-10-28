import { ModelEdge } from "./ModelEdge";
import { School } from "../model/School";
export declare class SchoolEdge extends ModelEdge<School> {
    name: string;
    pluralName: string;
    provider: School[];
    protected createModel: (obj: any) => School;
}
