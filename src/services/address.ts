import axios from 'axios';
import { IEndereco, IEnderecoAPIResponse } from '../types/Endereco';

export const AddressService = {
    async getAddress(lat: number, lng: number): Promise<IEndereco> {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

        try {
            const response = await axios.get<IEnderecoAPIResponse>(url, {
                headers: {
                    'User-Agent': 'com.ponto.parada.frontend' // Identify app
                },
                timeout: 8000
            });

            if (response.status === 200 && response.data.address) {
                const addr = response.data.address;
                return {
                    office: addr.office || '',
                    road: addr.road || '',
                    neighbourhood: addr.neighbourhood || '',
                    city: addr.city || '',
                    postcode: addr.postcode || ''
                };
            }
            throw new Error('Endereço não encontrado');
        } catch (e) {
            throw new Error('Erro ao buscar o endereço');
        }
    }
};
