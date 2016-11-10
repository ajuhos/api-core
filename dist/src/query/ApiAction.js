"use strict";
(function (ApiActionTriggerKind) {
    ApiActionTriggerKind[ApiActionTriggerKind["OnInput"] = 0] = "OnInput";
    ApiActionTriggerKind[ApiActionTriggerKind["BeforeOutput"] = 1] = "BeforeOutput";
    ApiActionTriggerKind[ApiActionTriggerKind["AfterOutput"] = 2] = "AfterOutput";
})(exports.ApiActionTriggerKind || (exports.ApiActionTriggerKind = {}));
var ApiActionTriggerKind = exports.ApiActionTriggerKind;
var ApiAction = (function () {
    function ApiAction(name, execute, triggerKind) {
        var _this = this;
        if (triggerKind === void 0) { triggerKind = ApiActionTriggerKind.OnInput; }
        this.triggerKind = ApiActionTriggerKind.OnInput;
        this.inspect = function () {
            return "api-action{" + _this.name + "}";
        };
        this.name = name;
        this.execute = execute;
        this.triggerKind = triggerKind;
    }
    return ApiAction;
}());
exports.ApiAction = ApiAction;
//# sourceMappingURL=ApiAction.js.map