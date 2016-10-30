import {RawDataProvider} from "../data/RawDataProvider";
import {Student} from "../model/Student";
import {ModelEdge} from "./ModelEdge";
import {ApiQueryScope} from "../../../src/query/ApiQuery";
import {ApiEdgeError} from "../../../src/query/ApiEdgeError";

export class StudentEdge extends ModelEdge<Student> {
    name = "student";
    pluralName = "students";

    provider = RawDataProvider.students;
    protected createModel = (obj: any): Student => new Student(obj);

    constructor() {
        super();

        this.entryMethod("rename", (scope: ApiQueryScope): Promise<ApiQueryScope> => {
            return new Promise((resolve, reject) => {
                if(!scope.response)
                    return reject(new ApiEdgeError(404, "Not Found"));

                const entry = scope.response.data;

                if(!scope.body || !scope.body.name)
                    return reject(new ApiEdgeError(422, "No Name Provided"));

                const nameParts = scope.body.name.split(' ');

                if(nameParts.length != 2 ||
                    !nameParts[0].length ||
                    !nameParts[1].length)
                    return reject(new ApiEdgeError(422, "Invalid Name Provided"));

                entry.firstName = nameParts[0];
                entry.lastName = nameParts[1];

                resolve(scope)
            })
        })
    }
}
