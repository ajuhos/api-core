import {LazyApiEdge} from "./LazyApiEdge";
import {Api} from "../Api";
import {ApiResolver} from "./ApiResolver";

export class LocalApiResolver implements ApiResolver {
    private readonly api: Api;

    constructor(api: Api) {
        this.api = api
    }

    resolveEdgeLazy(name: string, plural: boolean) {
        return this.api.edges.find(plural
            ? edge => edge.pluralName == name
            : edge => edge.name == name
        ) || new LazyApiEdge(this.api, name, plural, () => this.resolveEdge(name, plural))
    }

    async resolveEdge(name: string, plural: boolean) {
        const edge = this.api.edges.find(plural
            ? edge => edge.pluralName == name
            : edge => edge.name == name
        );
        if(edge && !(await edge.resolve())) return undefined;
        return edge
    }

    async resolveRelation(name: string) {
        const relation = this.api.relations.find(relation => relation.name === name);
        if(relation && !(await relation.resolve())) return undefined;
        return relation
    }

    async resolveRelationOfEdge(edge: string, name: string) {
        const relation = this.api.relations.find(relation =>
            relation.name === name && (relation.from.name === edge || relation.to.name === edge)
        );
        if(relation && !(await relation.resolve())) return undefined;
        return relation
    }

    async resolveRelationFrom(edge: string, name: string) {
        const relation = this.api.relations.find(relation =>
            relation.name === name && relation.from.name === edge
        );
        if(relation && !(await relation.resolve())) return undefined;
        return relation
    }

    async resolveRelationTo(edge: string, name: string) {
        const relation = this.api.relations.find(relation =>
            relation.name === name && relation.to.name === edge
        );
        if(relation && !(await relation.resolve())) return undefined;
        return relation
    }
}
