import { IHashMap } from "../../lib/ScreenMastah/Common/IHashMap";

export class GlobalFunctions{
    private static GlobalContainer = $("body");

    static getFormatedDate(date: Date): string{
		let d = date.getDate();
		let day = ((d<10)?"0":"") + d;

		let m = date.getMonth() + 1;
		let month = ((m<10)?"0":"") + m;

		let year = date.getFullYear();
		let result = `${day}/${month}/${year}`;
		return result;
    }
    
    static getFormatedTime(date: Date){
        return `${date.getHours()}:${date.getMinutes()}`;
    }
}

export class HTTPClient{
    private prefix:string;
    constructor(isSandbox: boolean){
        this.prefix = "";
        if(isSandbox){
            let sandbox = "http://localhost:8080";
            this.prefix = sandbox;
        }
    }
    put<ReturnType=any>(endpoint: string, data?: object): Promise<{state: ConnectionState,data?: ReturnType, error?: ConnErrorType}>{
        return new Promise<{state: ConnectionState,data?: ReturnType, error?: ConnErrorType}>((res, rej) => {
            $.ajax(this.prefix.concat(endpoint), {
                type: "PUT",
                data: data,
                dataType: "json",
                
                success: (data) => {
                    res({state: ConnectionState.OK, data: data});
                },
                error: (obj) => {
                    let msg = obj.responseText;
                    if(msg == "undefined"){
                        let newMsg = this.statusCodeTranslator(obj.status)
                        msg = newMsg ? newMsg : "Error";
                    }
                    res({state: ConnectionState.ERRORED, error: {obj, errText: msg}});
                }
            })
        });
        
    }
    post<ReturnType=any>(endpoint: string, data?: object): Promise<{state: ConnectionState,data?: ReturnType, error?: ConnErrorType}>{
        return new Promise<{state: ConnectionState,data?: ReturnType, error?: ConnErrorType}>((res, rej) => {
            $.ajax(this.prefix.concat(endpoint), {
                type: "POST",
                data: data,
                dataType: "json",
                
                success: (data) => {
                    res({state: ConnectionState.OK, data: data});
                },
                error: (obj) => {
                    let msg = obj.responseText;
                    if(msg == "undefined"){
                        let newMsg = this.statusCodeTranslator(obj.status)
                        msg = newMsg ? newMsg : "Error";
                    }
                    res({state: ConnectionState.ERRORED, error: {obj, errText: msg}});
                }
            })
        });
    }
    get<ReturnType=any>(endpoint: string, data?: object): Promise<{state: ConnectionState,data?: ReturnType, error?: ConnErrorType}>{
        return new Promise<{state: ConnectionState,data?: ReturnType, error?: ConnErrorType}>((res, rej) => {
            $.ajax(this.prefix.concat(endpoint), {
                type: "GET",
                data: data,
                dataType: "json",
                success: (data) => {
                    res({state: ConnectionState.OK, data: data});
                },
                error: (obj) => {
                    let msg = obj.responseText;
                    console.log(msg);
                    
                    if(!msg){
                        let newMsg = this.statusCodeTranslator(obj.status)
                        msg = newMsg ? newMsg : "Error";
                    }
                    res({state: ConnectionState.ERRORED, error: {obj, errText: msg}});
                }
            })
        });
    }
    delete<ReturnType=any>(endpoint: string, data?: object): Promise<{state: ConnectionState,data?: ReturnType, error?: ConnErrorType}>{
        return new Promise<{state: ConnectionState,data?: ReturnType, error?: ConnErrorType}>((res, rej) => {
            $.ajax(this.prefix.concat(endpoint), {
                type: "DELETE",
                data: data,
                dataType: "json",
                
                success: (data) => {
                    res({state: ConnectionState.OK, data: data});
                },
                error: (obj) => {
                    let msg = obj.responseText;
                    if(msg == "undefined"){
                        let newMsg = this.statusCodeTranslator(obj.status)
                        msg = newMsg ? newMsg : "Error";
                    }
                    res({state: ConnectionState.ERRORED, error: {obj, errText: msg}});
                }
            })
        });
    }

    private statusCodeTranslator(code: number){
        switch(code){
            case 0:
                return "Sin conexión con el servidor";
            default:
                return null;
        }
    }
}

export class ConnectionHandler{
    static isSandbox = true;
    static GetHTTPClient(){
        return new HTTPClient(ConnectionHandler.isSandbox);
    }
}

export type ConnErrorType = {
    obj: JQuery.jqXHR<any>,
    errText: string
}

export enum ConnectionState{
    OK = "OK",
    ERRORED = "ERR"
}

export type IndexableObject<T> = {
    obj: T,
    idx: number
}

export class EventHandler{
    static getNamespace(namespace: string){
        let obj = this.namespaces[namespace];
        if(obj)
            return obj;
        else{
            let neww = new EventHandler();
            this.namespaces[namespace] = neww;
            return neww;
        }
    }
    static namespaces: IHashMap<EventHandler> = {};

    private registeredEvents: IHashMap<(Event<any, any>)|undefined>;

    constructor(){
        this.registeredEvents = {};
    }

    register(id: string, event: Event<any, any>){
        this.registeredEvents[id] = event;
    }

    unregister(id: string){
        this.registeredEvents[id] = undefined;
    }

    call(id: string, arg?: Object){
        let event = this.registeredEvents[id];
        if(event)
            event(arg);
    }
}

export type Event<T1 extends Object, T2> = {
    (args?: T1):T2
}

export interface HashMap<T>{
    [key: string]: T;
}

export class Preloader{
    private preloaderContainer: JQuery;
    private static instance: Preloader;

    private constructor(){
        this.preloaderContainer = $("#myPreloader");
    }
    
    static getInstance(){
        if(this.instance == undefined){
            this.instance = new Preloader();
        }
        return this.instance;
    }

    toggle(show: boolean){
        this.preloaderContainer.toggle(show);
    }
}

export class ToastMaster{
    private static instance : ToastMaster | undefined;
    private _stack : Array<M.Toast | undefined>;
    private constructor(){
        this._stack = new Array<M.Toast | undefined>();
        this.setEvents();
    }

    static getInstance(){
        if(this.instance == undefined){
            this.instance = new ToastMaster();
        }
        return this.instance;
    }

    writeMessage(message: string, duration?: number | undefined){
        let length = 4000;
        if(duration){
            length = duration
        }
        let toast = M.toast({html: message, displayLength: length});
    }

    writeStaticMessage(message: string){
        let idx = this.getEmptyIdx();
        let toast = M.toast({html: `<span>${message}</span><button class="btn-flat toast-action" data-idx="${idx}"><i class="large material-icons">close</i></button>`, displayLength: 3600000});
        this._stack[idx] = toast;
        console.log(this._stack, idx);
    }

    private getEmptyIdx(): number{
        var i;
        for (i = 0; i < this._stack.length; i++) {
            const el = this._stack[i];
            if(el == undefined){
                return i;
            }
        }
        return i;
    }

    setEvents(){
        $(document).on("click", ".toast-action", (e) => {
            let idx = $(e.currentTarget).data("idx");
            console.log(idx);
            this._stack[idx]?.dismiss();
            this._stack[idx] = undefined;
            console.log(this._stack);
            
        })
    }

}