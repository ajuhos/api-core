import {RawDataProvider} from "../data/RawDataProvider";
import {ModelEdge} from "./ModelEdge";
import {Class} from "../model/Class";

export class ClassEdge extends ModelEdge<Class> {
    name = "class";
    pluralName = "classes";

    provider = RawDataProvider.classes;
    protected createModel = (obj: any) => new Class(obj);
}
