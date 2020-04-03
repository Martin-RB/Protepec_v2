export type Alot = {
    id: Number, 
    heads: Number, 
    maxHeads: Number, 
    maxWeight: Number, 
    minWeight: Number, 
    name: string, 
    protArrival: Number, 
    sex: string, 
    reimplants: [Implant], 
    idCorral: Number, 
    corralName: string, 
    status: ("Vendido"|"Cerrado"|"Abierto")
}

export type Implant = {
    idProt: Number,
    day: Number,
    isApplied: Boolean
}