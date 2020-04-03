import { ViewAble } from "../ScreenDynamicCommon/ViewAble";
import { BaseView } from "../ScreenDynamicCommon/BaseView";
import { IHashMap } from "../Common/IHashMap";
import { PopupCloseInfo } from "./PopupCloseInfo";

export abstract class BasePopup<TView extends BaseView> extends ViewAble<TView>{
    protected abstract viewType: new (container: JQuery<HTMLElement>) => TView;

    private _ID: string;
    protected ppData: IHashMap<any>;

    constructor(id: string){
        super();
        this._ID = id;
        this.ppData = {};
    }

    setData(data: IHashMap<any>){
        this.ppData = data;
    }

    get ID():string{
        return this._ID;
    }

    abstract async Open() : Promise<PopupCloseInfo>;

    onClose() : boolean{
        
        return true;
    }

}