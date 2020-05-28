import {RawDataProvider} from "../data/RawDataProvider";
import {Student} from "../model/Student";
import {ModelEdge} from "./ModelEdge";
import {ApiQueryScope} from "../../../src/query/ApiQuery";
import {ApiEdgeError} from "../../../src/query/ApiEdgeError";
import {ApiRequestType} from "../../../src/request/ApiRequest";
import {ApiEdgeQueryResponse} from "../../../src/edge/ApiEdgeQueryResponse";
import {ApiEdgeSchema, ApiEdgeSchemaTransformation} from "../../../src/edge/ApiEdgeSchema";
import {ApiEdgeQuery} from "../../../src/edge/ApiEdgeQuery";
import {ApiEdgeQueryType} from "../../../src/edge/ApiEdgeQueryType";

export class StudentEdge extends ModelEdge<Student> {
    name = "student";
    pluralName = "students";

    schema = new ApiEdgeSchema({
        id: "=",
        fullName: new ApiEdgeSchemaTransformation(
            (schema: any, model: any) => {
                const parts = schema.fullName.split(' ');
                if(parts.length != 2) throw new ApiEdgeError(400, "Invalid full name");
                model.firstName = parts[0];
                model.lastName = parts[1]
            },
            (model: any, schema: any) => {
                schema.fullName = [ model.firstName, model.lastName ].join(' ')
            },
            [ "firstName", "lastName" ],
            String
        ),
        email: "=",
        schoolId: "=",
        classId: "="
    });

    provider = RawDataProvider.students;
    protected createModel = (obj: any): Student => new Student(obj);

    constructor() {
        super();

        this.entryMethod("rename", (scope: ApiQueryScope): Promise<ApiEdgeQueryResponse> =>
            new Promise((resolve, reject) =>
                (new ApiEdgeQuery(this, ApiEdgeQueryType.Patch, scope.context, {
                    fullName: scope.body.name.split(' ').reverse().join(' ')
                })).execute().then(resolve, reject)), ApiRequestType.Change);

        this.entryMethod("withHungarianName", (scope: ApiQueryScope): Promise<ApiEdgeQueryResponse> => {
            return new Promise(resolve => {
                const student = JSON.parse(JSON.stringify((scope.response || {} as any).data));
                student.hungarianName = student.fullName.split(' ').reverse().join(' ');
                resolve(new ApiEdgeQueryResponse(student))
            })
        }, ApiRequestType.Read)
    }
}
