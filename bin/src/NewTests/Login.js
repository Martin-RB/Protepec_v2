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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "../ScreenMastah/PresenterCommon/BasePresenter", "../ScreenMastah/ScreenDynamicCommon/BaseView", "./Platform", "../ScreenMastah/PopupCommon/PopetMaster", "./YesNoPopup"], function (require, exports, BasePresenter_1, BaseView_1, Platform_1, PopetMaster_1, YesNoPopup_1) {
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
            this.View.OnSubmit = function (username, password) {
                _this.username = username;
                _this.password = password;
                _this.navigation.PushScreen(Platform_1.PlatformPresenter);
            };
        };
        LoginPresenter.prototype.OnStart = function (origin) {
            if (this.username != undefined && this.password != undefined) {
                this.View.SetInfo(this.username, this.password);
            }
        };
        LoginPresenter.prototype.OnClose = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = {
                                title: "Espera!",
                                text: "Estas seguro quieres cerrar sesión?"
                            };
                            return [4 /*yield*/, PopetMaster_1.PopetMaster.OpenPopup(YesNoPopup_1.YesNoPopup, data)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result.CloseStatus == YesNoPopup_1.YesNoPopup.YES_CS];
                    }
                });
            });
        };
        return LoginPresenter;
    }(BasePresenter_1.BasePresenter));
    exports.LoginPresenter = LoginPresenter;
    var LoginView = /** @class */ (function (_super) {
        __extends(LoginView, _super);
        function LoginView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pathScreen = "html/login.html";
            return _this;
        }
        LoginView.prototype.OnDraw = function () {
            var _this = this;
            this.F["login"].click(function () {
                var _a;
                (_a = _this._onSubmit) === null || _a === void 0 ? void 0 : _a.call(_this, _this.F["user"].val(), _this.F["password"].val());
            });
        };
        Object.defineProperty(LoginView.prototype, "OnSubmit", {
            set: function (event) {
                this._onSubmit = event;
            },
            enumerable: true,
            configurable: true
        });
        LoginView.prototype.SetInfo = function (username, password) {
            console.log(this.F["user"], username);
            this.F["user"].val(username);
            this.F["password"].val(password);
        };
        LoginView.prototype.GetInfo = function () {
            return { username: this.F["user"].val(), password: this.F["password"].val() };
        };
        return LoginView;
    }(BaseView_1.BaseView));
    exports.LoginView = LoginView;
});
