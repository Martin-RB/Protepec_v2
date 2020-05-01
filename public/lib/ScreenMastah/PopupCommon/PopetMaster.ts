import { BasePopup } from "./BasePopup";
import { PopupCloseInfo } from "./PopupCloseInfo";
import { IHashMap } from "../Common/IHashMap";
import { IConstructable } from "../Common/IConstructable";

export class PopetMaster{
    private static actualPopup: BasePopup<any> | null;
    private static popupDivHost: JQuery | null;
    private static container: JQuery = $("body");

    static IsAPopupOpen() : boolean{
        return this.actualPopup != null;
    }

    static async OpenPopup(popupType: IConstructable<BasePopup<any>>, data?: IHashMap<any>, id?: string) : Promise<PopupCloseInfo>{
        /* if(!(popupType instanceof BasePopup)){
            throw new EvalError("Popup pushed does not extend BasePopup");
        } */

        let realID = "A";
        if(id){
            realID = id;
        }
        
        let popup: BasePopup<any> = new popupType(realID);
        this.popupDivHost = $(`<div id="${realID}"></div>`);
        this.container.append(this.popupDivHost);
        popup.setContainer(this.popupDivHost);
        popup.InitView();
        await popup.DrawView();
        if(data){
            popup.setData(data);
        }
        let returnInfo = await popup.Open();
        
        PopetMaster.ClosePopup();
        return returnInfo;
    }

    static get ActualPopupInstance(): BasePopup<any> | null{
        return this.actualPopup;
    }

    static ClosePopup(): boolean{
        let wantToClose = this.actualPopup?.onClose();
        this.popupDivHost?.remove();
        this.popupDivHost = null;
        this.actualPopup = null;

        return (wantToClose == undefined)? true: wantToClose;
    }

}