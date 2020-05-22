export default class LocalStorageService {

    static adicionarItem(chave, valor) {
        localStorage.setItem(chave, JSON.stringify(valor));
    }

    static obterItem(chave) {
        return JSON.parse(localStorage.getItem(chave));
    }

    static removeItem(chave) {
        localStorage.removeItem(chave);
    }
}