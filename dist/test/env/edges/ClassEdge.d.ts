import { ModelEdge } from "./ModelEdge";
import { Class } from "../model/Class";
export declare class ClassEdge extends ModelEdge<Class> {
    name: string;
    pluralName: string;
    provider: Class[];
    protected createModel: (obj: any) => Class;
}
