export interface IAbrigo {
    idTipoAbrigo?: number;
    temPatologia: boolean;
    imgBlobPaths: string[];
    imagensPatologiaPaths: string[];
}

export interface IPonto {
    id?: number; // Isar auto-increment ID
    idUsuario: number;
    endereco: string;
    latitude: number;
    longitude: number;
    linhaEscolares: boolean;
    linhaStpc: boolean;
    latitudeInterpolado: number;
    longitudeInterpolado: number;
    dataVisita: string; // ISO 8601 string
    pisoTatil: boolean;
    rampa: boolean;
    patologia: boolean;
    baia: boolean;
    abrigos: IAbrigo[];
    imgBlobPaths?: string[]; // Optional in Dart model?
    imagensPatologiaPaths?: string[];

    // Custom field for sync status
    syncStatus?: 'synced' | 'pending' | 'failed';
}
