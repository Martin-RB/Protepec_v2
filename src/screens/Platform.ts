import { BasePresenter } from "../../lib/ScreenMastah/PresenterCommon/BasePresenter";
import { BaseView } from "../../lib/ScreenMastah/ScreenDynamicCommon/BaseView";
import { IHashMap } from "../../lib/ScreenMastah/Common/IHashMap";
import { Navigation } from "../../lib/ScreenMastah/NavigationCommon/Navigation";
import { HomePresenter } from "./Home";

export class PlatformPresenter extends BasePresenter<PlatformView>{
    protected _ID: string = "PLATFORM";
    protected viewType: new (container: JQuery<HTMLElement>) => PlatformView = PlatformView;
    
    private innerNav! : Navigation;

    OnCreate(){
        let navigatorContainer = this.View.GetInnerNavigationContainer();
        this.innerNav = new Navigation(navigatorContainer);

        this.View.SetLogoutEvent(() => this.navigation.TryPopScreen());
        this.View.GoToSection = (section:string) => {
            switch(section){
                case "home":
                    this.innerNav.PushScreen(HomePresenter);
                break;
                case "registerLorry":
                    this.innerNav.PushScreen(HomePresenter);
                break;
                case "workHeads":
                    this.innerNav.PushScreen(HomePresenter);
                break;
                case "feedCorrals":
                    this.innerNav.PushScreen(HomePresenter);
                break;
                case "admon":
                    this.innerNav.PushScreen(HomePresenter);
                break;
            }
        };
    }

    OnStart(){
        this.innerNav.PushScreen(HomePresenter);
    }

}

export class PlatformView extends BaseView{
    public pathScreen: string = "html/platform";
    private _goToSectionEvent: ((section: string, data?: IHashMap<any>) => void) | undefined;
    private _logoutEvent: (() => void) | undefined;
    private _sidenav_I!: M.Sidenav;
    private _tapTarget_I!: JQuery<HTMLElement>;
    private _topNav_Dropdown_I!: M.Dropdown;

    OnDraw(){
        this.setEvents();
        this.initSidenav();
        this.initDropdown();
        this.initTapTarget();

        setTimeout(() => {
            this._tapTarget_I.tapTarget("open");
        }, 500);
    }

    private setEvents() {

        this.F["close-session"].click(() => {
            this.destroySidenav();
            this.destroyTapTarget();
            this.destroyDropdown();
            this._logoutEvent?.call(this);
        })

        this.Container.find(".f_selectSection").click((e) => {
            this._goToSectionEvent?.(e.target.id);

            if(window.innerWidth < 993){
                this._sidenav_I.close();
            }
            
        });
    }

    set GoToSection(event: (section: string, data?: IHashMap<any>) => void){
        this._goToSectionEvent = event;
    }

    SetLogoutEvent(event: () => void){
        this._logoutEvent = event;
    }

    GetInnerNavigationContainer(){
        return this.F["innerNavigator"];
    }

    private initSidenav(){
        var elems = this.F["movile-sidenav"];
        this._sidenav_I = M.Sidenav.init(elems)[0];
    }

    private initTapTarget(){
        var elems = this.F["tasks"];
        this._tapTarget_I = elems.tapTarget()
    }

    private initDropdown() {
        var elems = this.Container.find(".dropdown-trigger");
        this._topNav_Dropdown_I = M.Dropdown.init(elems, {alignment: "right", constrainWidth: false})[0];
    }

    private destroySidenav(){
        this._sidenav_I.destroy();
    }

    private destroyTapTarget(){
        this._tapTarget_I.tapTarget("destroy");
    }

    private destroyDropdown() {
        this._topNav_Dropdown_I.destroy();
    }

}