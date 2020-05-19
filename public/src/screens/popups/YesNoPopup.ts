import { BasePopup } from "../../../lib/ScreenMastah/PopupCommon/BasePopup";
import { ViewAble } from "../../../lib/ScreenMastah/ScreenDynamicCommon/ViewAble";
import { BaseView } from "../../../lib/ScreenMastah/ScreenDynamicCommon/BaseView";
import { EventHandler } from "../General";
import { PopupCloseInfo } from "../../../lib/ScreenMastah/PopupCommon/PopupCloseInfo";
import { IHashMap } from "../../../lib/ScreenMastah/Common/IHashMap";

export class YesNoPopup extends BasePopup<YesNoView>{
    protected viewType: new (container: JQuery<HTMLElement>) => YesNoView = YesNoView;
    Open(): Promise<import("../../../lib/ScreenMastah/PopupCommon/PopupCloseInfo").PopupCloseInfo> {
        let eventHandler = EventHandler.getNamespace("YesNoPopup");
        let data = this.ppData;
        let title = data["title"];
        let content = data["content"];
        this.View.setModal(title, content);
        return new Promise((res, rej) => {
            eventHandler.register("onPopupClose", (closeCondition) => {
                let _closeCondition = closeCondition as IHashMap<any>;
                console.log(closeCondition)

                res(new PopupCloseInfo(_closeCondition["type"]));
            })
        });
    }

    static EXIT = "0";
    static NO = "1";
    static YES = "2"

}

class YesNoView extends BaseView{
    public pathScreen: string = "html/popups/yesNoPopup";
    private eventHandler = EventHandler.getNamespace("YesNoPopup");
    private closeCondition: string = YesNoPopup.EXIT;
    private modal! : M.Modal;

    OnDraw(){
        this.modal = M.Modal.init(this.F["my-modal"], {onCloseEnd: this.onModalClose})[0];
        this.modal.open();

        this.F["yes"].click(() => {
            this.closeCondition = YesNoPopup.YES;
            this.modal.close();
        });
        this.F["no"].click(() => {
            this.closeCondition = YesNoPopup.NO;
            this.modal.close();
        });
    }

    onModalClose = (el: Element) =>{
        let a : IHashMap<any> = {};
        a["type"] = this.closeCondition;
        this.eventHandler.call("onPopupClose", a);
    }

    setModal(title: string, content: string){
        this.F["title"].html(title);
        this.F["content"].html(content);
    }

}