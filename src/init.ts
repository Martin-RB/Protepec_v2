import { Navigation } from "./../lib/ScreenMastah/NavigationCommon/Navigation";
import { LoginPresenter } from "./screens/Login";

let masterNav = new Navigation($("#app"));
masterNav.PushScreen(LoginPresenter);