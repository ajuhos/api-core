import {RawDataProvider} from "../data/RawDataProvider";
import {ModelEdge} from "./ModelEdge";
import {School} from "../model/School";

export class SchoolEdge extends ModelEdge<School> {
    name = "school";
    pluralName = "schools";

    provider = RawDataProvider.schools;
    protected createModel = (obj: any) => new School(obj);
}
