import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../../components/card';
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/select-menu'
import LancamentoService from '../../app/services/lancamentoService';
import * as messages from '../../components/toastr'
import LocalStorageService from '../../app/services/localStorageService';

class CadastroLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        mes: '',
        ano: '',
        valor: 0,
        tipoLancamento: '',
        statusLancamento: '',
        idUsuario: 0,
        atualizando: false
    }


    constructor() {
        super();
        this.service = new LancamentoService();
    }

    componentDidMount() {
        const params = this.props.match.params
        if (params.id) {
            this.service.buscarPeloId(params.id)
                .then(response => {
                    this.setState({ ...response.data, atualizando: true })
                    console.log(response.data)
                }).catch(error => {
                    messages.mensagemErro('Lancamento não localizado pelo id ', params.id, error.response.data)
                })
        }
    }

    submit = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        const { descricao, mes, ano, valor, tipoLancamento } = this.state
        const lancamento = { descricao, mes, ano, valor, tipoLancamento, idUsuario: usuarioLogado.id }

        try {
            this.service.validar(lancamento)
        } catch (erro) {
            const mensagens = erro.mensagens;
            mensagens.forEach(msg => { messages.mensagemErro(msg) });
            return false;
        }


        this.service.salvar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Lancamento cadastrado com sucesso')
            }).catch(error => {
                messages.mensagemErro('Erro ao tentar salvar lançamento', error.response.data)
            })
    }

    atualizar = () => {
        const { descricao, mes, ano, valor, tipoLancamento, statusLancamento, idUsuario, id } = this.state
        const lancamento = { descricao, mes, ano, valor, tipoLancamento, statusLancamento, idUsuario, id }
        this.service.atualizar(lancamento)
            .then(response => {
                this.props.history.push('/consulta-lancamentos')
                messages.mensagemSucesso('Alterações realizadas comsucesso')
            }).catch(error => {
                messages.mensagemErro('Erro ao tentar atualizar lançamento', error.response.data)
            })
    }

    handleChange = (evento) => {
        const value = evento.target.value;
        const name = evento.target.name;
        this.setState({ [name]: value })
    }


    render() {

        const tipos = this.service.obterTipos();
        const meses = this.service.obterListaMeses();
        return (
            <Card title={this.state.atualizando ? 'Atualização de Lancamento' : 'Cadastro de Lancamentos'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descrição: *">
                            <input
                                id="inputDescricao"
                                type="text"
                                name="descricao"
                                className="form-control"
                                value={this.state.descricao}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano *">
                            <input
                                id="inputAno"
                                type="text"
                                className="form-control"
                                name="ano"
                                value={this.state.ano}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-6">

                        <FormGroup id="inputMes" label="Mês *">
                            <SelectMenu
                                id="inputMes"
                                lista={meses}
                                name="mes"
                                className="form-control"
                                value={this.state.mes}
                                onChange={this.handleChange}

                            />
                        </FormGroup>

                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor: *">
                            <input
                                id="inputValor"
                                type="text"
                                name="valor"
                                className="form-control"
                                value={this.state.valor}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo: *">
                            <SelectMenu
                                id="inputTipo"
                                lista={tipos}
                                name="tipoLancamento"
                                className="form-control"
                                value={this.state.tipoLancamento}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status">
                            <input
                                id="inputStatus"
                                type="text"
                                className="form-control"
                                name="statusLancamento"
                                disabled
                                value={this.state.statusLancamento}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {this.state.atualizando ? (
                            <button
                                onClick={this.atualizar}
                                className="btn btn-primary">
                                <i className="pi pi-refresh"></i> Atualizar
                            </button>
                        ) : (
                                <button
                                    onClick={this.submit}
                                    className="btn btn-success">
                                    <i className="pi pi-save"></i> Salvar
                                </button>

                            )
                        }

                        <button
                            onClick={e => this.props.history.push('/consulta-lancamentos')}
                            className="btn btn-danger"><i className="pi pi-backward"></i> Cancelar</button>
                    </div>
                </div>
            </Card>
        )
    }
}
export default withRouter(CadastroLancamentos);