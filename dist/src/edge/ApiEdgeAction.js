"use strict";
var ApiEdgeQueryType_1 = require("./ApiEdgeQueryType");
(function (ApiEdgeActionTrigger) {
    ApiEdgeActionTrigger[ApiEdgeActionTrigger["OutputQuery"] = 2] = "OutputQuery";
    ApiEdgeActionTrigger[ApiEdgeActionTrigger["SubQuery"] = 4] = "SubQuery";
    ApiEdgeActionTrigger[ApiEdgeActionTrigger["Method"] = 8] = "Method";
    ApiEdgeActionTrigger[ApiEdgeActionTrigger["Relation"] = 16] = "Relation";
    ApiEdgeActionTrigger[ApiEdgeActionTrigger["Query"] = 6] = "Query";
    ApiEdgeActionTrigger[ApiEdgeActionTrigger["Any"] = 30] = "Any";
})(exports.ApiEdgeActionTrigger || (exports.ApiEdgeActionTrigger = {}));
var ApiEdgeActionTrigger = exports.ApiEdgeActionTrigger;
(function (ApiEdgeActionTriggerKind) {
    ApiEdgeActionTriggerKind[ApiEdgeActionTriggerKind["BeforeEvent"] = 0] = "BeforeEvent";
    ApiEdgeActionTriggerKind[ApiEdgeActionTriggerKind["AfterEvent"] = 1] = "AfterEvent";
})(exports.ApiEdgeActionTriggerKind || (exports.ApiEdgeActionTriggerKind = {}));
var ApiEdgeActionTriggerKind = exports.ApiEdgeActionTriggerKind;
var ApiEdgeAction = (function () {
    function ApiEdgeAction(name, execute, targetTypes, triggerKind, triggers, triggerNames) {
        var _this = this;
        if (targetTypes === void 0) { targetTypes = ApiEdgeQueryType_1.ApiEdgeQueryType.Any; }
        if (triggerKind === void 0) { triggerKind = ApiEdgeActionTriggerKind.BeforeEvent; }
        if (triggers === void 0) { triggers = ApiEdgeActionTrigger.Any; }
        if (triggerNames === void 0) { triggerNames = []; }
        this.triggerKind = ApiEdgeActionTriggerKind.BeforeEvent;
        this.targetTypes = ApiEdgeQueryType_1.ApiEdgeQueryType.Any;
        this.triggers = ApiEdgeActionTrigger.Any;
        this.triggerNames = [];
        this.inspect = function () {
            return "action{" + _this.name + "}";
        };
        this.name = name;
        this.triggers = triggers;
        this.execute = execute;
        this.targetTypes = targetTypes;
        this.triggerKind = triggerKind;
        this.triggerNames = triggerNames;
    }
    return ApiEdgeAction;
}());
exports.ApiEdgeAction = ApiEdgeAction;
//# sourceMappingURL=ApiEdgeAction.js.map