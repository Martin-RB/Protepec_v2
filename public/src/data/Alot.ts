export type Alot = {
    id: number, 
    heads: number, 
    maxHeads: number, 
    maxWeight: number, 
    minWeight: number, 
    name: string, 
    protArrival: number, 
    protArrivalName: string,
    sex: string, 
    reimplants: [Implant], 
    idCorral: number, 
    corralName: string, 
    status: ("Vendido"|"Cerrado"|"Abierto")
}

export type Implant = {
    idProt: number,
    day: number,
    isApplied: Boolean
}