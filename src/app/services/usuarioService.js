import ApiService from '../apiservice'
import ErroValidacao from '../exceptions/ErroValidacao'
class UsuarioService extends ApiService {
    constructor() {
        super('/api/usuarios')
    }

    autenticar(credenciais) {
        return this.post('/autenticar', credenciais)
    }

    obterSaldoPorIdUsuario(id) {
        return this.get(`/saldo/${id}`)
    }

    salvar(usuario) {
        return this.post('/', usuario)
    }

    validar(usuario) {
        const erros = []

        if (!usuario.nome) {
            erros.push('O campo nome é obrigatório')
        }

        if (!usuario.email) {
            erros.push('O campo email é obrigatório')
        } else if (!usuario.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)) {
            erros.push('O email informado não é válido')
        }

        if (!usuario.senha || !usuario.senhaRepeticao) {
            erros.push('Os campos de senha são obrigatórios')
        } else if (usuario.senha !== usuario.senhaRepeticao) {
            erros.push('As senhas não conferem')
        }

        if (erros && erros.length > 0) {
            throw new ErroValidacao(erros)
        }
    }

}
export default UsuarioService;