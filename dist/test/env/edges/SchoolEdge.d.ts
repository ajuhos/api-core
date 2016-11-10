import { ModelEdge } from "./ModelEdge";
import { School } from "../model/School";
import { ApiEdgeSchema } from "../../../src/edge/ApiEdgeSchema";
export declare class SchoolEdge extends ModelEdge<School> {
    name: string;
    pluralName: string;
    schema: ApiEdgeSchema;
    provider: School[];
    protected createModel: (obj: any) => School;
}
