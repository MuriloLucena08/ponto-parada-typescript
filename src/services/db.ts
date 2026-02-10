import Dexie, { type Table } from 'dexie';
import { IPonto } from '../types/Ponto';
import { IUsuario } from '../types/Usuario';

export class PontoCertoDB extends Dexie {
    pontos!: Table<IPonto, number>;
    usuarios!: Table<IUsuario, number>;

    constructor() {
        super('PontoCertoDB');
        this.version(1).stores({
            pontos: '++id, idUsuario, syncStatus', // Primary key and indexed props
            usuarios: 'idUsuario', // Primary key
        });
    }
}

export const db = new PontoCertoDB();
