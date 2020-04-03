import { IHashMap } from "../Common/IHashMap";

export class PopupCloseInfo{
    

    constructor(public CloseStatus: string, public Data?: IHashMap<any>){

    }
}