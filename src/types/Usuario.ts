export interface IUsuario {
    idUsuario: number;
    nomeUsuario: string;
    matriculaUsuario: string;
    emailUsuario: string;
    senhaUsuario?: string; // Optional as we might not always have it/need it in frontend
}
