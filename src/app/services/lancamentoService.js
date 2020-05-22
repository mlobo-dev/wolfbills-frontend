import ApiService from '../apiservice'
import ErroValidacao from '../exceptions/ErroValidacao'

class LancamentoService extends ApiService {
    constructor() {
        super('/api/lancamentos/')
    }

    obterListaMeses() {
        return [
            { label: 'Selecione', value: '' },
            { label: 'Janeiro', value: 1 },
            { label: 'Fevereiro', value: 2 },
            { label: 'Março', value: 3 },
            { label: 'Abril', value: 4 },
            { label: 'Maio', value: 5 },
            { label: 'Junho', value: 6 },
            { label: 'Julho', value: 7 },
            { label: 'Agosto', value: 8 },
            { label: 'Setembro', value: 9 },
            { label: 'Outubro', value: 10 },
            { label: 'Novembro', value: 11 },
            { label: 'Dezembro', value: 12 }
        ]
    }

    obterTipos() {
        return [
            { label: 'Selecione', value: '' },
            { label: 'Despesa', value: 'DESPESA' },
            { label: 'Receita', value: 'RECEITA' },
        ]
    }

    consultar(filtro) {

        let params = `?ano=${filtro.ano}`
        if (filtro.mes) {
            params = `${params}&mes=${filtro.mes}`
        }
        if (filtro.tipo) {
            params = `${params}&tipo=${filtro.tipo}`
        }
        if (filtro.status) {
            params = `${params}&tipo=${filtro.status}`
        }

        if (filtro.usuario) {
            params = `${params}&usuario=${filtro.usuario}`
        }

        if (filtro.descricao) {
            params = `${params}&descricao=${filtro.descricao}`
        }

        return this.get(params)
    }

    deletar(id) {
        return this.delete(`/${id}`)
    }

    salvar(lancamento) {
        return this.post('', lancamento)
    }

    atualizar(lancamento) {
        return this.put(`${lancamento.id}`, lancamento)
    }

    buscarPeloId(id) {
        return this.get(`/${id}`)
    }

    alterarStatus(id, status) {
        return this.put(`atualizar-status/${id}`, { status })
    }

    validar(lancamento) {
        const erros = [];

        if (!lancamento.ano) {
            erros.push('Informe o Ano do Lancamento.')
        }

        if (!lancamento.mes) {
            erros.push('Informe o Mês do Lancamento.')
        }

        if (!lancamento.descricao) {
            erros.push('Informe a Descrição do Lancamento.')
        }

        if (!lancamento.valor) {
            erros.push('Informe o Valor do Lancamento.')
        }

        if (!lancamento.tipoLancamento) {
            erros.push('Informe o Tipo do Lancamento.')
        }


        if (erros && erros.length > 0) {
            throw new ErroValidacao(erros);
        }
    }

}
export default LancamentoService;