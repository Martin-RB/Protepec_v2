define(["require", "exports", "./../lib/ScreenMastah/NavigationCommon/Navigation", "./screens/Login"], function (require, exports, Navigation_1, Login_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var masterNav = new Navigation_1.Navigation($("#app"));
    masterNav.PushScreen(Login_1.LoginPresenter);
});
