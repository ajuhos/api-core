import {RawDataProvider} from "../data/RawDataProvider";
import {ModelEdge} from "./ModelEdge";
import {Class} from "../model/Class";
import {ApiEdgeSchema} from "../../../src/edge/ApiEdgeSchema";

export class ClassEdge extends ModelEdge<Class> {
    name = "class";
    pluralName = "classes";

    schema = new ApiEdgeSchema({
        id: "=",
        name: "=",
        semester: "=",
        room: "=",
        schoolId: "="
    });

    provider = RawDataProvider.classes;
    protected createModel = (obj: any) => new Class(obj);
}
