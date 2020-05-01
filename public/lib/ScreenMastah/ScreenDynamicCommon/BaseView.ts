import { IHashMap } from "../Common/IHashMap";

export abstract class BaseView{
    public abstract pathScreen: string;
    private onBackEvent: ((data: IHashMap<any>)=> void) | undefined
    protected F : IHashMap<JQuery>;
    private _container: JQuery;

    constructor(container : JQuery){
        this.F = {};
        this._container = container;
    }

    async Draw() : Promise<void>{
        await this.load();
        this.findFields();
        this.OnDraw();
    }

    OnDraw(){

    }

    get Container() : JQuery{
        return this._container;
    }

    set OnBackEvent(event : (data: IHashMap<any>) => void){
        this.onBackEvent = event;
    }

    private findFields(){
        this.F = {};
        this._container.find("[id]").each((_, a) => {
            this.F[a.id] = $(a);
        })
    }

    private async load() : Promise<void>{
        return new Promise<any>((resolve, reject)=>{
            this._container.load(this.pathScreen + ".html", (v,d,a) => {
                if(a.statusText == "OK"){
                    resolve();
                }
                else{
                    reject();
                }
            });
        })
    }
}