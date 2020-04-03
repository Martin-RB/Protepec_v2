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
define(["require", "exports", "../../lib/ScreenMastah/PresenterCommon/BasePresenter", "../../lib/ScreenMastah/ScreenDynamicCommon/BaseView"], function (require, exports, BasePresenter_1, BaseView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HomePresenter = /** @class */ (function (_super) {
        __extends(HomePresenter, _super);
        function HomePresenter() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._ID = "HOME";
            _this.viewType = HomeView;
            return _this;
        }
        return HomePresenter;
    }(BasePresenter_1.BasePresenter));
    exports.HomePresenter = HomePresenter;
    var HomeView = /** @class */ (function (_super) {
        __extends(HomeView, _super);
        function HomeView() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.pathScreen = "html/home";
            return _this;
        }
        HomeView.prototype.OnDraw = function () {
            var _this = this;
            this.F["search-input"].on("keyup", function (e) {
                var input = e.target;
                _this.fillResults(_this._searchEvent(input.value));
            });
            this.F["clear-search"].click(function () {
                _this.F["search-input"].val("");
                _this.emptyResults();
            });
        };
        HomeView.prototype.fillResults = function (result) {
        };
        HomeView.prototype.emptyResults = function () {
        };
        Object.defineProperty(HomeView.prototype, "searchEvent", {
            set: function (event) {
                this._searchEvent = event;
            },
            enumerable: true,
            configurable: true
        });
        HomeView.prototype.setTaskList = function () {
        };
        return HomeView;
    }(BaseView_1.BaseView));
    exports.HomeView = HomeView;
});
/* class SearchResult{
    constructor(
        public headResults: Array<Head>,
        public alotResults: Array<Alot>,
        public corralResults: Array<Corral>
    ){

    }
} */ 
