import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../../components/card';
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/select-menu'
import LancamentosTable from './lancamentosTable'
import LancamentoService from '../../app/services/lancamentoService'
import LocalStorageService from '../../app/services/localStorageService'
import * as messages from '../../components/toastr'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'



class ConsultaLancamentos extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipoLancamento: '',
        statusLancamento: '',
        showConfirmDialog: false,
        lancamentoDeletar: '',
        descricao: '',
        lancamentos: []
    }


    constructor() {
        super();
        this.service = new LancamentoService();
    }

    buscar = () => {
        if (!this.state.ano) {
            messages.mensagemAlerta('O Ano é obrigatório na consulta')
            return false;
        }
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        const filtro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipoLancamento,
            usuario: usuarioLogado.id,
            descricao: this.state.descricao
        }

        this.service
            .consultar(filtro)
            .then(resposta => {
                if (resposta.data.length < 1) {
                    messages.mensagemAlerta('Nenhum registro encontrado para os parâmetros informados')
                }
                this.setState({ lancamentos: resposta.data })

            }).catch(error => {
                messages.mensagemErro('Erro inesperado ao realizar consulta: ', error)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    alterarStatus = (lancamento, status) => {
        this.service
            .alterarStatus(lancamento.id, status)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento)
                if (index !== -1) {
                    lancamento['statusLancamento'] = status
                    lancamento[index] = lancamento
                    this.setState({ lancamentos });
                }
                messages.mensagemSucesso('Status atualizado com sucesso!')
            }).catch(error => {
                messages.mensagemErro('Não foi possível atualizar o status', error.response)
            })
    }

    abrirConfirmacao = (lancamento) => {
        this.setState({ showConfirmDialog: true, lancamentoDeletar: lancamento })
    }

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, lancamentoDeletar: [] })
    }

    deletar = () => {
        this.service
            .delete(this.state.lancamentoDeletar.id)
            .then(response => {
                const lancamentos = this.state.lancamentos
                const index = lancamentos.indexOf(this.state.lancamentoDeletar)
                lancamentos.splice(index, 1)
                this.setState({ lancamentos: lancamentos, showConfirmDialog: false })
                messages.mensagemSucesso('Deletado com sucesso!')
            }).catch(error => {
                messages.mensagemErro('Não foi possível deletar o lançamento: ', error)
            })
    }
    render() {
        const lista = this.service.obterListaMeses();
        const tiposLancamento = this.service.obterTipos();
        const confirmDialogFooter = (
            <div>
                <Button label="Sim" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarDelecao} />
            </div>
        );

        return (
            <Card title="Buscar Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputAno"
                                    aria-describedby="anoHelp"
                                    placeholder="Digite o ano"
                                    onChange={e => this.setState({ ano: e.target.value })}
                                />
                            </FormGroup>

                            <FormGroup htmlFor="inputMes" label="Mes: ">
                                <SelectMenu
                                    id="inputMes"
                                    value={this.state.mes}
                                    onChange={e => this.setState({ mes: e.target.value })}
                                    className="form-control" lista={lista}>

                                </SelectMenu>
                            </FormGroup>

                            <FormGroup htmlFor="inputDescricao" label="Descrição: ">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputDescricao"
                                    aria-describedby="descricaoHelp"
                                    placeholder="Digite a descrição"
                                    onChange={e => this.setState({ descricao: e.target.value })}
                                />
                            </FormGroup>


                            <FormGroup htmlFor="inputTipoLancamento" label="Tipo do Lançamento:">
                                <SelectMenu
                                    id="inputTipoLancamento"
                                    value={this.state.tipoLancamento}
                                    onChange={e => this.setState({ tipo: e.target.value })}
                                    className="form-control"
                                    lista={tiposLancamento}>

                                </SelectMenu>
                            </FormGroup>
                            <button
                                onClick={this.buscar}
                                type="button"
                                className="btn btn-success">
                                <i className="pi pi-search">Buscar</i>
                            </button>
                            <button
                                onClick={e => this.props.history.push('/cadastro-lancamentos')}
                                type="button"
                                className="btn btn-primary">
                                <i className="pi pi-plus"> Cadastrar</i>
                            </button>
                        </div>
                    </div>
                </div>
                <br />

                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable
                                lancamentos={this.state.lancamentos}
                                deleteAction={this.abrirConfirmacao}
                                editarAction={this.editar}
                                alterarStatus={this.alterarStatus}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog
                        header="Deletar Lançamento"
                        visible={this.state.showConfirmDialog}
                        style={{ width: '50vw' }}
                        modal={true}
                        footer={confirmDialogFooter}
                        onHide={() => this.setState({ showConfirmDialog: false })}>
                        Confirma a exclusão desse lancamento? essa ação não poderá ser desfeita.
                    </Dialog>


                </div>
            </Card>
        )
    }

}

export default withRouter(ConsultaLancamentos);