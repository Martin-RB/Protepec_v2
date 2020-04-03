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
define(["require", "exports", "../ScreenMastah/PresenterCommon/BasePresenter", "../ScreenMastah/ScreenDynamicCommon/BaseView", "../ScreenMastah/NavigationCommon/Navigation", "./Login"], function (require, exports, BasePresenter_1, BaseView_1, Navigation_1, Login_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlatformPresenter = /** @class */ (function (_super) {
        __extends(PlatformPresenter, _super);
        function PlatformPresenter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.viewType = PlatformView;
            _this._ID = "PLATFORM";
            return _this;
        }
        PlatformPresenter.prototype.OnCreate = function () {
            var _this = this;
            this.innerNavigation = new Navigation_1.Navigation(this.View.GetInnerNavigationContainer());
            this.innerNavigation.PushScreen(Login_1.LoginPresenter);
            this.View.OnLogoutClicked = function () {
                _this.navigation.TryPopScreen();
            };
        };
        PlatformPresenter.prototype.OnClose = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.innerNavigation == undefined) {
                                return [2 /*return*/, true];
                            }
                            return [4 /*yield*/, this.innerNavigation.TryPopScreen()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return PlatformPresenter;
    }(BasePresenter_1.BasePresenter));
    exports.PlatformPresenter = PlatformPresenter;
    var PlatformView = /** @class */ (function (_super) {
        __extends(PlatformView, _super);
        function PlatformView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pathScreen = "html/platform.html";
            return _this;
        }
        PlatformView.prototype.OnDraw = function () {
            var _this = this;
            this.F["home"].click(function () {
                var _a;
                (_a = _this.homeClickedEvent) === null || _a === void 0 ? void 0 : _a.call(_this);
            });
            this.F["logout"].click(function () {
                var _a;
                (_a = _this.logoutClickedEvent) === null || _a === void 0 ? void 0 : _a.call(_this);
            });
        };
        PlatformView.prototype.GetInnerNavigationContainer = function () {
            return this.F["container"];
        };
        Object.defineProperty(PlatformView.prototype, "OnHomeClicked", {
            set: function (event) {
                this.homeClickedEvent = event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformView.prototype, "OnAboutClicked", {
            set: function (event) {
                this.aboutClickedEvent = event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformView.prototype, "OnPage1Clicked", {
            set: function (event) {
                this.page1ClickedEvent = event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformView.prototype, "OnPage2Clicked", {
            set: function (event) {
                this.page2ClickedEvent = event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlatformView.prototype, "OnLogoutClicked", {
            set: function (event) {
                this.logoutClickedEvent = event;
            },
            enumerable: true,
            configurable: true
        });
        return PlatformView;
    }(BaseView_1.BaseView));
    exports.PlatformView = PlatformView;
});
