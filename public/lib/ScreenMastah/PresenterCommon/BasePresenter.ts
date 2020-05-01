import { BaseView } from "../ScreenDynamicCommon/BaseView";
import { ViewAble } from "../ScreenDynamicCommon/ViewAble";
import { Navigation } from "../NavigationCommon/Navigation";
import { IHashMap } from "../Common/IHashMap";
import { LoadOriginType } from "../NavigationCommon/LoadOriginType";

export abstract class BasePresenter<TView extends BaseView> extends ViewAble<TView>{
    private _navigation: Navigation | undefined;
    protected abstract _ID: string;
    protected fatherData: IHashMap<any> | undefined;
    protected sonData: IHashMap<any> | undefined;

    SetData(type: LoadOriginType, data: IHashMap<any>){
        if(type == LoadOriginType.FROM_FATHER){
            this.fatherData = data;
        }
        else if(type == LoadOriginType.FROM_SON){
            this.sonData = data;
        }
    }

    SetNavigation(navigation: Navigation){
        this._navigation = navigation;
    }

    get ID() : string{
        return this._ID;
    }

    get navigation() : Navigation{
        if(this._navigation == undefined){
            throw new EvalError("Called get navigation() when _navigation was not set. Call SetNavigation(navigation: Navigation) first.");
        }
        return this._navigation;
    }

    
    // Se ejecuta cada cuando se ha terminado de crear la pantalla. Esta funcion solo se ejecuta una vez en el ciclo de vida
    OnCreate(){

    }

    // Esta funcion se ejecuta cada vez que se inicializa la pantalla. Se ejecuta cuando se crea o restaura la pantalla
    OnStart(origin: LoadOriginType){

    }

    // Se ejecuta cuando la pantalla es mandada a segundo plano por otra pantalla.
    OnSuspend(){

    }

    // Se ejecuta cuando la pantalla sea llamada para cerrarse, se puede cancelar el cerrado retornando false
    async OnClose() : Promise<boolean>{
        return true;
    }

}