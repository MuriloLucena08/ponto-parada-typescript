export interface IParada {
    criadoPor: string;
    criadoEm: string;
    visitadoEm: string;
    endereco: string;
    abrigoNome: string;
    abrigoImg: string;
    latitude: number;
    longitude: number;
    dscNome: string; // Nome da RA
    dscBacia: string;
    linhaEscolar: boolean;
    linhaStpc: boolean;
}

// Corresponds to 'Paradas' in paradas_model.dart (Dftrans code?)
export interface IParadaDftrans {
    point: { lat: number, lng: number };
    codDftrans: string;
}
