import { BasePresenter } from "../../lib/ScreenMastah/PresenterCommon/BasePresenter";
import { BaseView } from "../../lib/ScreenMastah/ScreenDynamicCommon/BaseView";

export class RegisterLorryPresenter extends BasePresenter<RegisterLorryView>{
    protected _ID: string = "REGISTERLORRY";
    protected viewType: new (container: JQuery<HTMLElement>) => RegisterLorryView = RegisterLorryView;


}

export class RegisterLorryView extends BaseView{
    public pathScreen: string = "html/registerLorry";

}