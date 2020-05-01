import { BaseView } from "../ScreenDynamicCommon/BaseView";

export abstract class ViewAble<TView extends BaseView> {
    
    protected _container : JQuery | undefined;
    protected _inner_view : TView | undefined;
    protected abstract viewType : new(container: JQuery) => TView;

    setContainer(container: JQuery):void{
        this._container = container;
    }

    get container() : JQuery{
        if(this._container == undefined){
            throw new EvalError("Called get container() when _container was not set. Call setContainer(container: JQuery) first.");
        }
        return this._container;
    }

    // Ejecutado cuando se va a iniciar (new) el view
    InitView(){
        this._inner_view = new this.viewType(this.container);
    }

    // Ejecutado cuando se va a dibujar el view en el container
    async DrawView(){
        await this.View.Draw();
    }

    get View() : TView{
        if(this._inner_view == undefined){
            throw new EvalError("Called get View() when _inner_view was not set. Call InitView() first.");
        }
        return this._inner_view;
    }


}