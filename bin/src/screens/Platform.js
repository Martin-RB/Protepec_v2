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
define(["require", "exports", "../../lib/ScreenMastah/PresenterCommon/BasePresenter", "../../lib/ScreenMastah/ScreenDynamicCommon/BaseView", "../../lib/ScreenMastah/NavigationCommon/Navigation", "./Home"], function (require, exports, BasePresenter_1, BaseView_1, Navigation_1, Home_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlatformPresenter = /** @class */ (function (_super) {
        __extends(PlatformPresenter, _super);
        function PlatformPresenter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._ID = "PLATFORM";
            _this.viewType = PlatformView;
            return _this;
        }
        PlatformPresenter.prototype.OnCreate = function () {
            var _this = this;
            var navigatorContainer = this.View.GetInnerNavigationContainer();
            this.innerNav = new Navigation_1.Navigation(navigatorContainer);
            this.View.SetLogoutEvent(function () { return _this.navigation.TryPopScreen(); });
            this.View.GoToSection = function (section) {
                switch (section) {
                    case "home":
                        _this.innerNav.PushScreen(Home_1.HomePresenter);
                        break;
                    case "registerLorry":
                        _this.innerNav.PushScreen(Home_1.HomePresenter);
                        break;
                    case "workHeads":
                        _this.innerNav.PushScreen(Home_1.HomePresenter);
                        break;
                    case "feedCorrals":
                        _this.innerNav.PushScreen(Home_1.HomePresenter);
                        break;
                    case "admon":
                        _this.innerNav.PushScreen(Home_1.HomePresenter);
                        break;
                }
            };
        };
        PlatformPresenter.prototype.OnStart = function () {
            this.innerNav.PushScreen(Home_1.HomePresenter);
        };
        return PlatformPresenter;
    }(BasePresenter_1.BasePresenter));
    exports.PlatformPresenter = PlatformPresenter;
    var PlatformView = /** @class */ (function (_super) {
        __extends(PlatformView, _super);
        function PlatformView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pathScreen = "html/platform";
            return _this;
        }
        PlatformView.prototype.OnDraw = function () {
            this.initSidenav();
            this.initDropdown();
            this.initTapTarget();
            this.setEvents();
            this._tapTarget_I.open();
        };
        PlatformView.prototype.setEvents = function () {
            var _this = this;
            this.F["close-session"].click(function () {
                var _a;
                (_a = _this._logoutEvent) === null || _a === void 0 ? void 0 : _a.call(_this);
            });
            this.Container.find(".f_selectSection").click(function (e) {
                var _a, _b;
                (_b = (_a = _this)._goToSectionEvent) === null || _b === void 0 ? void 0 : _b.call(_a, e.target.id);
                if (window.innerWidth < 993) {
                    _this._sidenav_I.close();
                }
            });
        };
        Object.defineProperty(PlatformView.prototype, "GoToSection", {
            set: function (event) {
                this._goToSectionEvent = event;
            },
            enumerable: true,
            configurable: true
        });
        PlatformView.prototype.SetLogoutEvent = function (event) {
            this._logoutEvent = event;
        };
        PlatformView.prototype.GetInnerNavigationContainer = function () {
            return this.F["innerNavigator"];
        };
        PlatformView.prototype.initSidenav = function () {
            var elems = this.F["movile-sidenav"];
            this._sidenav_I = M.Sidenav.init(elems)[0];
        };
        PlatformView.prototype.initTapTarget = function () {
            var elems = this.Container.find(".tap-target")[0];
            this._tapTarget_I = M.TapTarget.init(elems);
        };
        PlatformView.prototype.initDropdown = function () {
            var elems = this.Container.find(".dropdown-trigger");
            var instances = M.Dropdown.init(elems, { alignment: "right", constrainWidth: false });
        };
        return PlatformView;
    }(BaseView_1.BaseView));
    exports.PlatformView = PlatformView;
});
