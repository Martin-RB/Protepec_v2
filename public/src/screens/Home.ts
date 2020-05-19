import { BasePresenter } from "../../lib/ScreenMastah/PresenterCommon/BasePresenter";
import { BaseView } from "../../lib/ScreenMastah/ScreenDynamicCommon/BaseView";
import { Head } from "../data/Head";
import { Alot } from "../data/Alot";
import { Corral } from "../data/Corral";

export class HomePresenter extends BasePresenter<HomeView>{
    protected _ID: string = "HOME";
    protected viewType: new (container: JQuery<HTMLElement>) => HomeView = HomeView;

    

}

export class HomeView extends BaseView{
    public pathScreen: string = "html/home";
    private _searchEvent!: ((search: string) => SearchResult);
    
    OnDraw(){
        this.F["search-input"].on("keyup", (e) => {
            let input = e.target as HTMLInputElement;
            this.fillResults(this._searchEvent(input.value));
        });
        this.F["clear-search"].click(() => {
            this.F["search-input"].val("");
            this.emptyResults();
        });
    }

    private fillResults(result: SearchResult){

    }

    private emptyResults(){

    }

    set onResultsRequested(event: (search: string) => SearchResult){
        this._searchEvent = event;
    }

    set onResultsCleared(event: () => void){

    }

    private setTaskList(){
        
    }
}

type SearchResult = {
    headResults: Array<Head>,
    alotResults: Array<Alot>,
    corralResults: Array<Corral>
}

/* class SearchResult{
    constructor(
        public headResults: Array<Head>,
        public alotResults: Array<Alot>,
        public corralResults: Array<Corral>
    ){

    }
} */