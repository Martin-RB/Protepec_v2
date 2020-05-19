import { BasePresenter } from "./../../lib/ScreenMastah/PresenterCommon/BasePresenter";
import { BaseView } from "./../../lib/ScreenMastah/ScreenDynamicCommon/BaseView";
import { PlatformPresenter } from "./Platform";

export class LoginPresenter extends BasePresenter<LoginView>{
    protected _ID: string = "LOGIN";
    protected viewType: new (container: JQuery<HTMLElement>) => LoginView = LoginView;

    OnCreate(){
        this.View.SetOnLogin((username, password) => {
            let asd = M.Sidenav.getInstance($("body")[0]);
            this.navigation.PushScreen(PlatformPresenter);
        })
    }
}

export class LoginView extends BaseView{
    public pathScreen: string = "html/login";

    private _onLogin : ((username: string, password: string) => void) | undefined;

    SetOnLogin(event: (username: string, password: string) => void){
        this._onLogin = event;
    }
    
    OnDraw(){
        this.setEvents();
    }

    private setEvents(){
        this.F["login"].click(() => {
            let username: string = this.F["username"].val() as string;
            let password: string = this.F["password"].val() as string;
            this._onLogin?.call(this, username, password);
        })
    }
}