"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ApiEdgeQueryResponse = (function () {
    function ApiEdgeQueryResponse(data, metadata) {
        if (metadata === void 0) { metadata = null; }
        this.data = data;
        this.metadata = metadata;
    }
    return ApiEdgeQueryResponse;
}());
exports.ApiEdgeQueryResponse = ApiEdgeQueryResponse;
var ApiEdgeQueryStreamResponse = (function (_super) {
    __extends(ApiEdgeQueryStreamResponse, _super);
    function ApiEdgeQueryStreamResponse(stream, metadata) {
        if (metadata === void 0) { metadata = null; }
        _super.call(this, null, metadata);
        this.stream = stream;
    }
    return ApiEdgeQueryStreamResponse;
}(ApiEdgeQueryResponse));
exports.ApiEdgeQueryStreamResponse = ApiEdgeQueryStreamResponse;
//# sourceMappingURL=ApiEdgeQueryResponse.js.map