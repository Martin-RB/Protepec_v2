"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ViewAble_1 = require("../ScreenDynamicCommon/ViewAble");
var BasePopup = /** @class */ (function (_super) {
    __extends(BasePopup, _super);
    function BasePopup(id) {
        var _this = _super.call(this) || this;
        _this._ID = id;
        _this.ppData = {};
        return _this;
    }
    BasePopup.prototype.setData = function (data) {
        this.ppData = data;
    };
    Object.defineProperty(BasePopup.prototype, "ID", {
        get: function () {
            return this._ID;
        },
        enumerable: true,
        configurable: true
    });
    BasePopup.prototype.onClose = function () {
        return true;
    };
    return BasePopup;
}(ViewAble_1.ViewAble));
exports.BasePopup = BasePopup;
