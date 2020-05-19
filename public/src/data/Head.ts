export type Head = {
    id: number,
    idLorry: number,
    idBreed: number,
    breedName: string, /* No en base de datos */
    idAlot: number,
    siniga: string,
    localID: string,
    sex: Sex,
    weight: number,
    alotName: string,
    idCorral: number,
    corralName: string,
    providerName: string,
    state: ("Vendido"|"Defunción"|"OK")
}

export enum Sex {
    male = "male",
    female = "female"
}