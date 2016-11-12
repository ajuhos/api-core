"use strict";
var ApiEdgeAction_1 = require("./ApiEdgeAction");
var ApiEdgeActionCollection = (function () {
    function ApiEdgeActionCollection() {
        this.beforeMethodActions = [];
        this.beforeSubQueryActions = [];
        this.beforeOutputActions = [];
        this.beforeRelationActions = [];
        this.afterMethodActions = [];
        this.afterSubQueryActions = [];
        this.afterOutputActions = [];
        this.afterRelationActions = [];
    }
    ApiEdgeActionCollection.prototype.add = function (action) {
        if (action.triggerKind == ApiEdgeAction_1.ApiEdgeActionTriggerKind.BeforeEvent) {
            if (action.triggers & ApiEdgeAction_1.ApiEdgeActionTrigger.SubQuery) {
                this.beforeSubQueryActions.push(action);
            }
            if (action.triggers & ApiEdgeAction_1.ApiEdgeActionTrigger.Method) {
                this.beforeMethodActions.push(action);
            }
            if (action.triggers & ApiEdgeAction_1.ApiEdgeActionTrigger.OutputQuery) {
                this.beforeOutputActions.push(action);
            }
            if (action.triggers & ApiEdgeAction_1.ApiEdgeActionTrigger.Relation) {
                this.beforeRelationActions.push(action);
            }
        }
        else {
            if (action.triggers & ApiEdgeAction_1.ApiEdgeActionTrigger.SubQuery) {
                this.afterSubQueryActions.push(action);
            }
            if (action.triggers & ApiEdgeAction_1.ApiEdgeActionTrigger.Method) {
                this.afterMethodActions.push(action);
            }
            if (action.triggers & ApiEdgeAction_1.ApiEdgeActionTrigger.OutputQuery) {
                this.afterOutputActions.push(action);
            }
            if (action.triggers & ApiEdgeAction_1.ApiEdgeActionTrigger.Relation) {
                this.afterRelationActions.push(action);
            }
        }
    };
    ApiEdgeActionCollection.prototype.getFor = function (triggerKind, query, edgeQuery, relation, output) {
        if (output === void 0) { output = false; }
        var edge = edgeQuery.edge, queryType = edgeQuery.type, trigger = relation ?
            ApiEdgeAction_1.ApiEdgeActionTrigger.Relation :
            (output ? ApiEdgeAction_1.ApiEdgeActionTrigger.OutputQuery : ApiEdgeAction_1.ApiEdgeActionTrigger.SubQuery);
        if (relation) {
        }
        var actions;
        if (relation) {
            actions = edge.actions.filter(function (action) {
                return action.triggerKind == triggerKind &&
                    (action.targetTypes & queryType) &&
                    (action.triggers & trigger) &&
                    (!action.triggerNames.length || action.triggerNames.indexOf(relation.name) == -1);
            });
        }
        else {
            actions = edge.actions.filter(function (action) {
                return action.triggerKind == triggerKind &&
                    (action.targetTypes & queryType) &&
                    (action.triggers & trigger);
            });
        }
        actions.forEach(function (action) { return query.unshift(action); });
    };
    return ApiEdgeActionCollection;
}());
exports.ApiEdgeActionCollection = ApiEdgeActionCollection;
//# sourceMappingURL=ApiEdgeActionCollection.js.map