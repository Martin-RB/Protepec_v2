import { IHashMap } from "../Common/IHashMap";
import { BasePresenter } from "../PresenterCommon/BasePresenter";
import { IConstructable } from "../Common/IConstructable";
import { LoadOriginType } from "./LoadOriginType";

export class Navigation{

    private container : JQuery;
    private screenStack: Array<BasePresenter<any>>;

    constructor(container:JQuery){
        this.container = container;
        this.screenStack = [];
    }

    async PushScreen(presenterType: IConstructable<BasePresenter<any>>, data?: IHashMap<any>){
/*         if(presenterType instanceof BasePresenter){
            throw new EvalError(`Screen pushed (${presenterType .ID}) is not BasePresenter type`)
        } */
        let screen: BasePresenter<any> = new presenterType();

        this.getLastScreen()?.OnSuspend();
        this.screenStack.push(screen);
        screen.setContainer(this.container);
        screen.SetNavigation(this);
        if(data){
            screen.SetData(LoadOriginType.FROM_FATHER, data);
        }
        screen.InitView();
        await screen.DrawView();
        screen.OnCreate();
        screen.OnStart(LoadOriginType.FROM_FATHER);
    }

    async TryPopScreen(data?: IHashMap<any>) : Promise<boolean>{        
        if(!this.hasScreens()){
            return true;
        }
        
        let screen = this.getLastScreen();
        if(screen == undefined){
            return true;
        }

        let closeResult = await screen.OnClose();
        
        if(!(closeResult)){
            return false;
        }

        this.screenStack.pop();
        screen = this.getLastScreen();

        if(screen == undefined){
            return true;
        }
        
        if(data){
            screen.SetData(LoadOriginType.FROM_SON, data);
        }

        await screen.DrawView();
        screen.OnStart(LoadOriginType.FROM_SON);
        return true;
    }

    async TryPopAllScreens() : Promise<boolean>{
        while(this.hasScreens()){
            if(!await this.TryPopScreen()){
                return false;
            }
        }
        return true;
    }

    CanPop() : boolean{
        return this.screenStack.length > 1;
    }

    private hasScreens() : boolean{
        return this.screenStack.length > 0 ;
    }

    private getLastScreen() : BasePresenter<any> | undefined{
        return this.screenStack[this.screenStack.length - 1];
    }
}