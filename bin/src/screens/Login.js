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
define(["require", "exports", "./../../lib/ScreenMastah/PresenterCommon/BasePresenter", "./../../lib/ScreenMastah/ScreenDynamicCommon/BaseView", "./Platform"], function (require, exports, BasePresenter_1, BaseView_1, Platform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoginPresenter = /** @class */ (function (_super) {
        __extends(LoginPresenter, _super);
        function LoginPresenter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._ID = "LOGIN";
            _this.viewType = LoginView;
            return _this;
        }
        LoginPresenter.prototype.OnCreate = function () {
            var _this = this;
            this.View.SetOnLogin(function (username, password) {
                var asd = M.Sidenav.getInstance($("body")[0]);
                _this.navigation.PushScreen(Platform_1.PlatformPresenter);
            });
        };
        return LoginPresenter;
    }(BasePresenter_1.BasePresenter));
    exports.LoginPresenter = LoginPresenter;
    var LoginView = /** @class */ (function (_super) {
        __extends(LoginView, _super);
        function LoginView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pathScreen = "html/login";
            return _this;
        }
        LoginView.prototype.SetOnLogin = function (event) {
            this._onLogin = event;
        };
        LoginView.prototype.OnDraw = function () {
            this.setEvents();
        };
        LoginView.prototype.setEvents = function () {
            var _this = this;
            this.F["login"].click(function () {
                var _a;
                var username = _this.F["username"].val();
                var password = _this.F["password"].val();
                (_a = _this._onLogin) === null || _a === void 0 ? void 0 : _a.call(_this, username, password);
            });
        };
        return LoginView;
    }(BaseView_1.BaseView));
    exports.LoginView = LoginView;
});
