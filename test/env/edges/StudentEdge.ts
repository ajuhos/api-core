import {RawDataProvider} from "../data/RawDataProvider";
import {Student} from "../model/Student";
import {ModelEdge} from "./ModelEdge";
import {ApiQueryScope} from "../../../src/query/ApiQuery";
import {ApiEdgeError} from "../../../src/query/ApiEdgeError";
import {ApiRequestType} from "../../../src/request/ApiRequest";
import {ApiEdgeQueryResponse} from "../../../src/edge/ApiEdgeQueryResponse";

export class StudentEdge extends ModelEdge<Student> {
    name = "student";
    pluralName = "students";

    provider = RawDataProvider.students;
    protected createModel = (obj: any): Student => new Student(obj);

    constructor() {
        super();

        this.entryMethod("rename", (scope: ApiQueryScope): Promise<ApiEdgeQueryResponse> => {
            return new Promise((resolve, reject) => {
                if(!scope.body || !scope.body.name)
                    return reject(new ApiEdgeError(422, "No Name Provided"));

                const nameParts = scope.body.name.split(' ');

                if(nameParts.length != 2 ||
                    !nameParts[0].length ||
                    !nameParts[1].length)
                    return reject(new ApiEdgeError(422, "Invalid Name Provided"));

                this.getEntry(scope.context).then((response: any) => {
                    const student = response.data;
                    student.firstName = nameParts[0];
                    student.lastName = nameParts[1];

                    resolve(new ApiEdgeQueryResponse(student))
                }).catch(reject);
            })
        }, ApiRequestType.Change);

        this.entryMethod("withFullName", (scope: ApiQueryScope): Promise<ApiEdgeQueryResponse> => {
            return new Promise((resolve, reject) => {
                if(!scope.response)
                    return reject(new ApiEdgeError(404, "Not Found"));

                const student = JSON.parse(JSON.stringify(scope.response.data));
                student.fullName = [ student.firstName, student.lastName ].join(' ');
                resolve(new ApiEdgeQueryResponse(student))
            })
        }, ApiRequestType.Read)
    }
}
