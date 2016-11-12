import {RawDataProvider} from "../data/RawDataProvider";
import {ModelEdge} from "./ModelEdge";
import {School} from "../model/School";
import {ApiEdgeSchema} from "../../../src/edge/ApiEdgeSchema";

export class SchoolEdge extends ModelEdge<School> {
    name = "school";
    pluralName = "schools";

    schema = new ApiEdgeSchema({
        id: "=",
        name: "=",
        address: "=",
        phone: "="
    });

    provider = RawDataProvider.schools;
    protected createModel = (obj: any) => new School(obj);
}
