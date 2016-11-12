import { ModelEdge } from "./ModelEdge";
import { Class } from "../model/Class";
import { ApiEdgeSchema } from "../../../src/edge/ApiEdgeSchema";
export declare class ClassEdge extends ModelEdge<Class> {
    name: string;
    pluralName: string;
    schema: ApiEdgeSchema;
    provider: Class[];
    protected createModel: (obj: any) => Class;
}
