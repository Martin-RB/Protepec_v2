import { BasePresenter } from "../../lib/ScreenMastah/PresenterCommon/BasePresenter";
import { BaseView } from "../../lib/ScreenMastah/ScreenDynamicCommon/BaseView";
import { Lorry } from "../data/Lorry";
import { Head, Sex } from "../data/Head";
import { Alot } from "../data/Alot";
import { Breed } from "../data/Breed";
import { ConnectionHandler, ConnectionState, IndexableObject, GlobalFunctions, HTTPClient, EventHandler, ConnErrorType, Preloader, ToastMaster } from "./General";
import { LoadOriginType } from "../../lib/ScreenMastah/NavigationCommon/LoadOriginType";
import { YesNoPopup } from "./popups/YesNoPopup";
import { PopetMaster } from "../../lib/ScreenMastah/PopupCommon/PopetMaster";
import { IHashMap } from "../../lib/ScreenMastah/Common/IHashMap";
import { HomePresenter } from "./Home";

class WorkHeadsModel{
    private _lorries : Array<Lorry>;
    private _breeds: Array<Breed>;
    private _alots: Array<Alot>;
    private _formHead: HeadScreenData | undefined;
    private _actualHead: number | undefined;
    private _actualLorry: number | undefined;
    private _actualHeads: Head[] | undefined;
    private _search: string | undefined;

    constructor(){
        this._lorries = [];
        this._breeds = [];
        this._alots = [];
    }

    SetLorries(data: Array<Lorry>){
        this._lorries = data;
    }
    SetBreeds(data: Array<Breed>){
        this._breeds = data;
    }
    SetAlots(data: Array<Alot>){
        this._alots = data;
    }
    SetHeadIdx(idx: number | undefined){
        this._actualHead = idx;
    }
    SetHeads(heads: Head[]){
        this._actualHeads = heads;
    }
    SetActualLorry(idx: number | undefined){
        this._actualLorry = idx;
    }
    SetSearch(search: string){
        
    }
    SaveScreenData(data: HeadScreenData){

    }

    GetLorries(){
        return this.toIndexableArray(this._lorries);
    }
    GetBreeds(){
        return this.toIndexableArray(this._breeds);
    }
    GetMatchedAlots(weight: number, sex: Sex){
        let ret: Array<IndexableObject<Alot>> = [];
        for (let i = 0; i < this._alots.length; i++) {
            const el = this._alots[i];
            if(el.sex == sex && el.maxWeight >= weight && el.minWeight <= weight && el.heads < el.maxHeads){
                ret.push({obj: el, idx: i});
            }
        }
        return ret;
    }
    GetAlotFromIdx(idx: number) : Alot | undefined{
        return this._alots[idx];
    }
    GetBreedFromIdx(idx: number) : Breed | undefined{
        return this._breeds[idx];
    }
    GetIdxFromAlotID(id: number){
        return this._alots.findIndex((v) => v.id == id);
    }
    GetIdxFromBreedID(id: number){
        return this._breeds.findIndex((v) => v.id == id);
    }
    GetFormHead(){
        return this._formHead;
    }
    GetHeadIdx(){
        return this._actualHead;
    }
    GetHeadFromIdx(idx: number){
        if(this._actualHeads)
            return this._actualHeads[idx];
        return undefined;
    }
    GetHeads(search?: string){
        if(!this._actualHeads){
            return new Array<IndexableObject<Head>>();
        }
        let heads = this.toIndexableArray(this._actualHeads);
        let ret : Array<IndexableObject<Head>> = [];
        if(!search){
            return heads;
        }

        heads.forEach((v) => {
            if(v.obj.siniga.includes(search))
                ret.push(v);
        });
        
        return ret;
    }
    GetActualLorry(){
        return this._actualLorry;
    }
    GetSearch() : string{
        let s = this._search;
        if(s)
            return s;
        else
            return "";
    }
    GetSavedScreenData(): HeadScreenData | undefined{
        return undefined;
    }

    private toIndexableArray<T>(array: Array<T>){
        let indexableArray : Array<IndexableObject<T>> = [];
        array.forEach((el, i) => {
            indexableArray.push({obj: el, idx: i});
        });
        return indexableArray;
    }
}

export class WorkHeadsPresenter extends BasePresenter<WorkHeadsView>{
    protected _ID: string = "WORKHEADS";
    protected viewType: new (container: JQuery<HTMLElement>) => WorkHeadsView = WorkHeadsView;

    private model!: WorkHeadsModel;
    private srvHandler!: WorkHeadsServerHandler;
    private eventHandler!: EventHandler;

    OnCreate(){
        this.model = new WorkHeadsModel();
        this.srvHandler = new WorkHeadsServerHandler();
        this.eventHandler = EventHandler.getNamespace("WORKHEADS");

        this.setEvents();
    }

    OnStart(origin: LoadOriginType){
        this.View.inputLock(true);
        if(origin == LoadOriginType.FROM_FATHER){
            this.procGetLorries();
            this.procGetBreeds();
            this.procGetAlots();
            this.View.selectLorry(-1);
        }
        else{
            let search = this.model.GetSearch();
            let screenData = this.model.GetSavedScreenData();
            this.View.setLorries(this.model.GetLorries());
            this.View.setBreeds(this.model.GetBreeds());
            this.View.setHeads(this.model.GetHeads(search));
            this.View.setSearch(search);
            if(screenData)
                this.View.setFields(screenData);
            else
                this.View.setFields(null);
        }
    }

    async asd(){
        let userConfirm = await PopetMaster.OpenPopup(YesNoPopup, {title: "asd", content: "A"});
    }

    showLorries(){
        
        this.View.setLorries(this.model.GetLorries());
    }

    private setLorryHeads(){
        let lorry = this.model.GetActualLorry();
        if(lorry){
            this.View.setLorryHeadInfo(this.model.GetHeads().length, this.model.GetLorries()[lorry].obj.heads);
        }
        else{
            this.View.setLorryHeadInfo(0, 0);
        }
    }

    private setEvents() {
        this.eventHandler.register("OnLorrySelected", async (dat) => {
            let idx = dat;
            let putIdx = idx
            if(idx == -1){
                putIdx = undefined;
            }
            this.model.SetActualLorry(putIdx);
            
            let lorry = this.model.GetLorries()[idx];
            let id = -1;
            if(lorry){
                id = lorry.obj.id;
                this.View.inputLock(false);
            }
            await this.procGetHeads(id);
            this.setLorryHeads();
        });

        this.eventHandler.register("OnAlotRecommend", (dat) => {
            let weight = dat.weight;
            let sex = dat.sex;
            
            let _weight = weight as number;
            let _sex = sex as Sex;

            let alots = this.model.GetMatchedAlots(_weight, _sex);
            
            this.View.setMatchedAlots(alots);

            if(alots.length == 0){
                this.View.toggleNewAlotButton(true);
            }
            else{
                this.View.toggleNewAlotButton(false);
            }
        });
        this.eventHandler.register("OnAlotChange", (idx) => {
            if(idx == undefined){
                this.View.setAlotData(undefined);
                return;
            }
            let _idx = idx as number;

            let alot = this.model.GetAlotFromIdx(_idx);
            if(alot)
                this.View.setAlotData(alot);
            else
                this.View.writeTemporalMessage("Lote inexistente. Seleccione otro")
        })
        this.eventHandler.register("OnHeadRegister", async () => {
            let _data = this.View.getFields();
            let sendData = this.getSendData(_data);
            if(sendData == null) return;
            let lorryIdx = this.model.GetActualLorry();
            let lorry = this.model.GetLorries()[lorryIdx ? lorryIdx : -1];
            
            if(lorryIdx && lorry){
                let headIdx = this.model.GetHeadIdx();
                this.View.setLoadingScreen(true);
                if(headIdx){
                    let head = this.model.GetHeadFromIdx(headIdx);
                    if(!head){
                        this.View.writeTemporalMessage("No hay cabeza la cual editar");
                        this.View.setLoadingScreen(false);
                        return;
                    }
                    let result = await this.srvHandler.updateHead(head?.id, sendData, lorry.obj.id);
                    if(result.state == ConnectionState.OK){
                        this.model.SetHeadIdx(undefined);
                    }
                    else{
                        this.View.writeStaticMessage("Error registrando cabeza: " + result.error?.errText);
                        this.View.setLoadingScreen(false);
                        return;
                    }
                }
                else{
                    let result = await this.srvHandler.uploadHead(sendData, lorry.obj.id)
                    if(result.state == ConnectionState.ERRORED){
                        this.View.writeStaticMessage("Error registrando cabeza: " + result.error?.errText);
                        this.View.setLoadingScreen(false);
                        return;
                    }
                }
                this.View.setLoadingScreen(false);
            }
            else{
                this.View.setLoadingScreen(false);
                this.View.writeTemporalMessage("Seleccione una jaula antes de continuar");
                return;
            }
            
            await this.procGetHeads(lorry.obj.id);
            this.View.setFields(null);

            await this.procGetAlots();
            this.setLorryHeads();

        });
        this.eventHandler.register("OnSearchChange", (search) => {
            let _search = search as string;
            this.model.SetSearch(_search);
            this.View.setHeads(this.model.GetHeads(_search));
        });
/*         this.eventHandler.register("OnHeadEdit", (idx) => {
            let _idx = idx as number;
            this.model.SetHeadIdx(_idx);
            let head = this.model.GetHeads()[_idx];
            let screenData = this.getScreenDataFromHead(head.obj);
            this.View.setFields(screenData);
        }); */
        this.eventHandler.register("OnHeadDelete", async (idx) => {            
            let _idx = idx as number;
            let head = this.model.GetHeads()[_idx];
            let data : IHashMap<any>= {};
            let lorryIdx = this.model.GetActualLorry();
            if(!lorryIdx || !(this.model.GetLorries()[lorryIdx])){
                this.View.writeTemporalMessage("No se ha seleccionado ninguna jaula");
                return;
            }
            let lorryId = this.model.GetLorries()[lorryIdx].obj.id;
            data["title"] = "Cuidado";
            data["content"] = `Estas a punto de elimiar la cabeza ${head.obj.siniga}. ¿Deseas continuar?`;
            let userConfirm = await PopetMaster.OpenPopup(YesNoPopup, data);
            if(userConfirm.CloseStatus == YesNoPopup.YES){
                let result = await this.srvHandler.deleteHead(head.obj.id, lorryId);
                if(result.state == ConnectionState.OK){
                    this.View.writeTemporalMessage(`Cabeza ${head.obj.siniga} eliminada con exito`);
                }
                else{
                    this.View.writeStaticMessage(`Error eliminando cabeza ${head.obj.siniga}: ${result.error?.errText}`);
                }

                this.procGetHeads(lorryId);
                this.procGetAlots();

            }
        });
        this.eventHandler.register("OnNewAlot", () => {
            let data = this.View.getFields();
            this.model.SaveScreenData(data);
            let sendingData : IHashMap<any> = {};
            sendingData["weight"] = data.weight;
            sendingData["sex"] = data.sex;
            this.navigation.PushScreen(HomePresenter, sendingData);
        });

        this.eventHandler.register("OnAlotSelected", (idx) => {
            this.View.setAlotData(this.model.GetAlotFromIdx(idx));
        });

        this.eventHandler.register("OnWorkLorry", () => {
            this.doSubmitLorry();
        });
    }

    private async doSubmitLorry(){
        let lorryIdx = this.model.GetActualLorry();
        if(!lorryIdx){
            this.View.writeTemporalMessage("Seleccione una jaula antes de continuar");
            return;
        }
        let lorries = this.model.GetLorries();
        let lorry = lorries[lorryIdx];

        let lorryId = lorry.obj.id;
        let lorryName = lorry.obj.num.toString();
        let heads = this.model.GetHeads().length;
        let lorryMaxHeads = lorry.obj.heads;

        if(heads < lorryMaxHeads){
            this.View.writeTemporalMessage("La jaula aun contiene cabezas. Falta registrar " + (lorryMaxHeads - heads).toString());
            return;
        }

        this.View.setLoadingScreen(true);
        let result = await this.srvHandler.submitLorry(lorryId);
        if(result.state == ConnectionState.OK){
            this.View.writeTemporalMessage(`Jaula ${lorryName} trabajada correctamente`);
            await this.procGetLorries();
            this.View.selectLorry(-1);
            this.View.setFields(null);
            this.View.inputLock(true);
        }
        else{
            this.View.writeStaticMessage(`Error registrando jaula ${lorryName}: ${result.error?.errText}`);
        }
        this.View.setLoadingScreen(false);
    }

    private getScreenDataFromHead(head: Head): HeadScreenData{
        let ret : HeadScreenData = {
            idxAlot: this.model.GetIdxFromAlotID(head.id),
            idxBreed: this.model.GetIdxFromBreedID(head.idBreed),
            localID: head.localID,
            sex: head.sex,
            siniga: head.siniga,
            weight: head.weight
        };
        return ret;
    }

    private async procGetHeads(lorryID: number){
        this.View.setLoadingScreen(true);
        let result = await this.srvHandler.fetchHeads(lorryID);
        if(result.state == ConnectionState.OK){
            this.model.SetHeads(result.data!);
            this.View.setHeads(this.model.GetHeads(this.model.GetSearch()));
            this.View.setLoadingScreen(false);
        }
        else{
            this.View.writeStaticMessage("No se han podido obtener las cabezas: " + result.error?.errText);
        }
    }
    private async procGetBreeds(){
        this.View.setLoadingScreen(true);
        let result = await this.srvHandler.fetchBreeds();
        if(result.state == ConnectionState.OK){
            this.model.SetBreeds(result.data!);
            this.View.setBreeds(this.model.GetBreeds());
        }
        else{
            this.View.writeStaticMessage("No se han podido obtener las razas: " + result.error?.errText);
        }
        this.View.setLoadingScreen(false);
    }
    private async procGetAlots(){
        this.View.setLoadingScreen(true);
        let result = await this.srvHandler.fetchAlots();
        if(result.state == ConnectionState.OK){
            this.model.SetAlots(result.data!);
        }
        else{
            this.View.writeStaticMessage("No se han podido obtener los lotes: " + result.error?.errText);
        }
        this.View.setLoadingScreen(false);
    }
    private async procGetLorries(){
        this.View.setLoadingScreen(true);
        let result = await this.srvHandler.fetchLorries();
        if(result.state == ConnectionState.OK){
            this.model.SetLorries(result.data!);
        }
        else{
            this.View.writeStaticMessage("No se han podido obtener las jaulas: " + result.error?.errText);
        }
        this.View.setLoadingScreen(false);
        this.showLorries();
    }

    private getSendData(sd: HeadScreenData): HeadSendData | null{
        let areFilled = true;
        this.View.setErroredField(Fields.none);

        if(sd.siniga == ""){
            this.View.setErroredField(Fields.siniga);
            areFilled = false;
        }
        if(sd.localID == ""){
            this.View.setErroredField(Fields.idLocal);
            areFilled = false;
        }
        if(sd.sex == undefined){
            this.View.setErroredField(Fields.sex);
            areFilled = false;
        }
        if(isNaN(sd.weight)){   
            this.View.setErroredField(Fields.weight);
            areFilled = false;
        }
        if(sd.idxAlot == -1){
            this.View.setErroredField(Fields.alot);
            areFilled = false;
        }
        if(sd.idxBreed == -1){
            this.View.setErroredField(Fields.breed);
            areFilled = false;
        }

        if(!areFilled){
            this.View.writeTemporalMessage("Llene todos los campos antes de continuar");
            return null;
        }

        let alot = this.model.GetAlotFromIdx(sd.idxAlot);
        if(alot == undefined){
            this.View.writeTemporalMessage("Lote invalido. Seleccione otro");
            return null;
        }

        let breed = this.model.GetBreedFromIdx(sd.idxBreed);
        if(breed == undefined){
            this.View.writeTemporalMessage("Raza invalida. Seleccione otra");
            return null;
        }

        return {
            idAlot: alot.id, idBreed: breed.id, localID: sd.localID, 
            sex: sd.sex!, siniga: sd.siniga, weight: sd.weight
        };
        
    }

}

export class WorkHeadsView extends BaseView implements IWorkHeadsView{
    selectLorry(lorryIdx: number): void {
        this.F["lorries-list"].val(lorryIdx).change()
    }
    setLorryHeadInfo(heads: number, maxHeads: number): void {
        this.F["lorryHeads"].html(heads.toString());
        this.F["lorryMaxHeads"].html(maxHeads.toString());
    }
    

    /**
    id="lorries-list"
    id="siniga"
    id="localID"
    id="breed-list"
    id="weight"
    id="alotList"
    id="newAlot"
    id="alotActualCap"
    id="alotMaxCap"
    id="alotProtocol"
    id="search"
    id="head-list"
     */

    public pathScreen: string = "html/workHeads";
    private eventHandler!: EventHandler;
    
    OnDraw(){
        this.F["head-list"].collapsible();
        
        // Events
        this.eventHandler = EventHandler.getNamespace("WORKHEADS");
        this.F["lorries-list"].change(() => {
            this.eventHandler.call("OnLorrySelected", this.F["lorries-list"].val());
        });
        this.F["weight"].keyup(() => this.alotRecommend());
        this.Container.find("[name=sexGrp]").change(() => this.alotRecommend());

        this.F["alotList"].change(() => {
            this.eventHandler.call("OnAlotChange", this.F["alotList"].val());
        })

        this.F["registerHead"].click(() => {
            this.eventHandler.call("OnHeadRegister")
        });

        this.F["workHeads"].click(() => {
            this.eventHandler.call("OnWorkLorry");
        });

/*         this.Container.on("click", ".f_edit", (e) => {            
            let idx = $(e.currentTarget).data("idx");
            this.eventHandler.call("OnHeadEdit", idx);
        }); */
        this.Container.on("click", ".f_delete", (e) => {
            let idx = $(e.currentTarget).data("idx");
            this.eventHandler.call("OnHeadDelete", idx);
        })
        this.F["search"].keyup(() => {
            this.eventHandler.call("OnSearchChange", this.F["search"].val());
        })
    }

    private alotRecommend(this: WorkHeadsView){        
        let weight = parseFloat(this.fieldToString(this.F["weight"].val()));   
        let sex = this.getSexSelection();

        this.eventHandler.call("OnAlotRecommend", {weight, sex})
    }
    
    setBreeds(breeds: IndexableObject<Breed>[]): void {
        this.F["breed-list"].find(":not([value=-1])").remove();
        breeds.forEach(el => {
            this.F["breed-list"].append(`
            <option value="${el.idx}">${el.obj.name}</option>
            `)
        });
    }
    setLorries(lorries: IndexableObject<Lorry>[]): void {
        this.F["lorries-list"].find(":not([value=-1])").remove();
        lorries.forEach(el => {
            let dateObj = new Date(el.obj.date);
            let date = GlobalFunctions.getFormatedDate(dateObj);
            let time = GlobalFunctions.getFormatedTime(dateObj);
            this.F["lorries-list"].append(`
                <option value="${el.idx}">${date} @ ${time}: #${el.obj.num} de ${el.obj.provider}</option>
            `)
        });
    }
    
    setSearch(search: string): void {
        this.F["search"].val(search);
    }
    getFields(): HeadScreenData {
        let idxAlot = parseInt(this.fieldToString(this.F["alotList"].find("option:checked").val()));
        
        let idxBreed = parseInt(this.fieldToString(this.F["breed-list"].find("option:checked").val()));
        let localID = this.fieldToString(this.F["localID"].val());
        let siniga = this.fieldToString(this.F["siniga"].val());
        let sex = this.getSexSelection();
        let weight = parseFloat(this.fieldToString(this.F["weight"].val()));
        return {
            idxAlot,
            idxBreed,
            siniga,
            localID,
            sex,
            weight
        }
    }
    
    toggleNewAlotButton(show: boolean): void {
        this.F["newAlot"].toggle(show);
    }
    setHeads(heads: IndexableObject<Head>[]): void {
        this.F["head-list"].find(":not([value=-1])").remove();
        heads.forEach(el => {
            let t = this.headTemplate.replace(":siniga:", el.obj.siniga)
                            .replace(":localID:", el.obj.localID)
                            .replace(":breed:", el.obj.breedName)
                            .replace(":sex:", el.obj.sex == Sex.male ? "Macho" : "Hembra")
                            .replace(":alotName:", el.obj.alotName)
                            .replace(":weight:", el.obj.weight.toString())
                            .replace(":corralName:", el.obj.corralName)
                            .replace(":idx:", el.idx.toString())
                            .replace(":idx:", el.idx.toString())
            this.F["head-list"].append(t);
        });
    }
    setMatchedAlots(alots: IndexableObject<Alot>[]): void {
        this.F["alotList"].find(":not([value=-1])").remove();1
        let alotTemplate = `<option value=":idx:">:name:</option>`
        alots.forEach(el => {
            let t = alotTemplate.replace(":idx:", el.idx.toString())
                                .replace(":name:", el.obj.name);
            this.F["alotList"].append(t);
        });
    }
    inputLock(locked: boolean): void {        
        this.F["siniga"].prop("disabled", locked);
        this.F["localID"].prop("disabled", locked);
        this.F["breed-list"].prop("disabled", locked);
        this.F["weight"].prop("disabled", locked);
        this.F["alotList"].prop("disabled", locked);
        this.F["newAlot"].prop("disabled", locked);
        this.F["alotActualCap"].prop("disabled", locked);
        this.F["alotMaxCap"].prop("disabled", locked);
        this.F["alotProtocol"].prop("disabled", locked);
        this.F["search"].prop("disabled", locked);
        this.F["head-list"].prop("disabled", locked);
        this.Container.find("[name=sexGrp]").prop("disabled", locked);
        this.F["registerHead"].prop("disabled", locked);
        this.F["workHeads"].prop("disabled", locked);
        if(locked){
            this.F["registerHead"].attr("disabled", "disabled")
            this.F["workHeads"].attr("disabled", "disabled")
        }
        else{
            this.F["registerHead"].removeAttr("disabled")
            this.F["workHeads"].removeAttr("disabled")
        }
        
    }
    writeStaticMessage(message: string): void {
        ToastMaster.getInstance().writeStaticMessage(message);
    }
    writeTemporalMessage(message: string, duration?: number | undefined): void {
        ToastMaster.getInstance().writeMessage(message, duration);
    }
    setLoadingScreen(doView: boolean): void {
        Preloader.getInstance().toggle(doView);
    }
    setAlotData(alot: Alot | undefined): void {
        this.F["alotActualCap"].html("");
        this.F["alotMaxCap"].html("");
        this.F["alotProtocol"].html("");

        if(alot != null){
            this.F["alotActualCap"].html(alot.heads.toString());
            this.F["alotMaxCap"].html(alot.maxHeads.toString());
            this.F["alotProtocol"].html(alot.protArrivalName);
        }
    }
    setFields(data: HeadScreenData | null): void {
        this.F["siniga"].val(data ? data.siniga : "");
        this.F["localID"].val(data ? data.localID : "");
        this.F["weight"].val(data ? data.weight.toString() : "");
        this.setSexSelection(data?.sex);
        this.eventHandler.call("OnAlotRecommend", {weight: data?.weight, sex: data?.sex});
        this.F["alotList"].val(data ? data.idxAlot : -1);
        this.F["breed-list"].val(data ? data.idxBreed : -1);
        M.updateTextFields();
    }
    setErroredField(fields: Fields): void {
        switch(fields){
            case Fields.siniga:
                this.setInputErrored(this.F["siniga"], true);
                break;
            case Fields.idLocal:
                this.setInputErrored(this.F["localID"], true);
                break;
            case Fields.weight:
                this.setInputErrored(this.F["weight"], true);
                break;
            case Fields.sex:
                this.setSexErrored(true);
                break;
            case Fields.alot:
                this.setSelectError(this.F["alotList"], true);
                break;
            case Fields.breed:
                this.setSelectError(this.F["breed-list"], true);
                break;
            case Fields.none:
                this.setInputErrored(this.F["siniga"], false);
                this.setInputErrored(this.F["localID"], false);
                this.setInputErrored(this.F["weight"], false);
                this.setSexErrored(false);
                this.setSelectError(this.F["alotList"], false);
                this.setSelectError(this.F["breed-list"], false);
                break;
        }
    }

    private setInputErrored(field: JQuery, isErrored: boolean){
        if(isErrored){
            field.addClass("erroredField");
            field.next().addClass("erroredField");
        }
        else{
            field.removeClass("erroredField");
            field.next().removeClass("erroredField");
        }
    }

    private setSexErrored(isErrored: boolean){
        $(this.Container.find("[name=sexGrp]").next()).css("color", isErrored ? "red":"unset");
    }

    private setSelectError(select: JQuery, isErrored: boolean){
        select.css("border", isErrored ? "1px solid red" : "unset")
    }

    private getSexSelection() : Sex | undefined{
        let checked = this.Container.find("[name=sexGrp]:checked");
        
        if(checked.length == 0){
			return undefined;
        }
        if(checked.val() != Sex.female && checked.val() != Sex.male){
            return undefined;
        }
		return checked.val() as Sex;
    }
    private setSexSelection(sex : Sex | undefined) {
        this.Container.find("[name=sex]").prop("checked", false);
		this.Container.find("[name=sex]"+':input[value="'+sex+'"]').prop("checked", true);
    }

    private fieldToString(v: string | number | string[] | undefined) : string{
        switch(typeof v){
            case "string":
                return v;
            case "number":
                return v.toString()
            case "object":
                return v[0];
            case "undefined":
                return "";
        }
    }
    private headTemplate = `
        <li>
            <div class="collapsible-header">
                <div class="lItem">
                    <span class="lItem-title">SINIGA</span>
                    <span class="lItem-content">:siniga:</span>
                </div>
                <div class="lItem">
                    <span class="lItem-title">ID. Local</span>
                    <span class="lItem-content">:localID:</span>
                </div>
            </div>
            <div class="collapsible-body">
                <ul>
                    <li>Raza: <span>:breed:</span></li>
                    <li>Sexo: <span>:sex:</span></li>
                    <li>Lote: <span>:alotName:</span></li>
                    <li>Peso: <span>:weight:</span></li>
                    <li>Corral: <span>:corralName:</span></li>
                </ul>
                <a class="f_delete" data-idx=":idx:"><i class="material-icons right lIcon">clear</i></a>
                <!-- <a class="f_edit" data-idx=":idx:"><i class="material-icons right lIcon">edit</i></a> -->
            </div>
        </li>`;

}

interface IWorkHeadsView{
    setLorries(lorries: Array<IndexableObject<Lorry>>): void;
    setHeads(heads: Array<IndexableObject<Head>>) : void;
    setBreeds(breeds: Array<IndexableObject<Breed>>) : void;
    setMatchedAlots(alots: Array<IndexableObject<Alot>>) : void;
    inputLock(locked: boolean): void;
    writeStaticMessage(message: string) : void;
    writeTemporalMessage(message: string, duration?: number): void;
    setLoadingScreen(doView : boolean) :void;
    setAlotData(alot: Alot | undefined) : void;
    setFields(data: HeadScreenData | null) : void;
    getFields(): HeadScreenData;
    toggleNewAlotButton(show: boolean): void;
    setSearch(search: string): void;
    setErroredField(fields: Fields): void;
    setLorryHeadInfo(heads: number, maxHeads: number): void;
    selectLorry(lorryIdx: number): void;
}

class WorkHeadsServerHandler{
    private httpClient: HTTPClient;

    constructor(){  
        this.httpClient = ConnectionHandler.GetHTTPClient();
    }

    fetchLorries(){
        return this.httpClient.get<Lorry[]>("/lorries/names");
    }
    fetchBreeds(){
        return this.httpClient.get<Breed[]>("/breeds");
    }
    fetchAlots(){
        return this.httpClient.get<Alot[]>("/alots");
    }
    fetchHeads(lorryID: number){
        return this.httpClient.get<Head[]>("/heads/lorries/" + lorryID);
    }

    uploadHead(head: HeadSendData, lorryID: number){
        return this.httpClient.post<number>("/heads/lorries/" + lorryID, head);
    }

    updateHead(id: number, sendData: HeadSendData, lorryID: number){
        return this.httpClient.post<number>(`/heads/${id}/lorries/${lorryID}`, sendData);
    }

    deleteHead(id: number, lorryId: number) : Promise<{state: ConnectionState,data?: ReturnType<any>, error?: ConnErrorType}>{
        return this.httpClient.delete<boolean>(`/heads/${id}/lorries/${lorryId}`);
    }

    submitLorry(lorryId: number){
        return this.httpClient.put(`/lorries/${lorryId}`);
    }
}

type HeadScreenData = {
    idxBreed: number, 
    idxAlot: number, 
    siniga: string, 
    localID: string, 
    sex: Sex | undefined, 
    weight: number
}

type HeadSendData = {
    idBreed: number, 
    idAlot: number, 
    siniga: string, 
    localID: string, 
    sex: string, 
    weight: number
}

enum Fields{
    siniga,
    idLocal,
    alot,
    breed,
    sex,
    weight,
    none
}