export interface IEndereco {
    office: string;
    road: string;
    neighbourhood: string;
    city: string;
    postcode: string;
}

export interface IEnderecoAPIResponse {
    address?: {
        office?: string;
        road?: string;
        neighbourhood?: string;
        city?: string;
        postcode?: string;
    }
}
