import { Navigation } from "./../lib/ScreenMastah/NavigationCommon/Navigation";
import { LoginPresenter } from "./screens/Login";
import { Preloader } from "./screens/General";

Preloader.getInstance().toggle(false);
let masterNav = new Navigation($("#app"));
masterNav.PushScreen(LoginPresenter);