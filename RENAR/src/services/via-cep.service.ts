export interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

export interface ViaCepError {
    erro: boolean;
}

export class ViaCepService {
    private static readonly BASE_URL = 'https://viacep.com.br/ws';

    /**
     * Busca dados de endereço pelo CEP
     * @param cep - CEP no formato 00000-000 ou 00000000
     * @returns Promise com os dados do endereço ou erro
     */
    static async buscarCep(cep: string): Promise<ViaCepResponse> {
        // Remove caracteres não numéricos
        const cepLimpo = cep.replace(/\D/g, '');

        // Valida se o CEP tem 8 dígitos
        if (cepLimpo.length !== 8) {
            throw new Error('CEP deve ter 8 dígitos');
        }

        try {
            const response = await fetch(`${this.BASE_URL}/${cepLimpo}/json/`);

            if (!response.ok) {
                throw new Error('Erro na requisição ao ViaCEP');
            }

            const data: ViaCepResponse | ViaCepError = await response.json();

            if ('erro' in data && data.erro) {
                throw new Error('CEP não encontrado');
            }

            return data as ViaCepResponse;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro inesperado ao buscar CEP');
        }
    }

    /**
     * Formata CEP para exibição (00000-000)
     * @param cep - CEP sem formatação
     * @returns CEP formatado
     */
    static formatarCep(cep: string): string {
        const cepLimpo = cep.replace(/\D/g, '');
        return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    /**
     * Valida se o CEP está no formato correto
     * @param cep - CEP para validar
     * @returns true se o CEP é válido
     */
    static validarCep(cep: string): boolean {
        const cepLimpo = cep.replace(/\D/g, '');
        return cepLimpo.length === 8 && /^\d{8}$/.test(cepLimpo);
    }
}
