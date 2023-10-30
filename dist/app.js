const enumaradorDasOperacoes = {
    ADICAO: '+',
    SUBTRACAO: '-',
    MULTIPLICACAO: 'x',
    DIVISAO: '/'
};
const operadores = ['+', '-', 'x', '/'];
const operadoresPrioritarios = ['x', '/'];
const operadoresNormais = ['+', '-'];
class Calculadora {
    constructor(pilha, display) {
        this.pilha = pilha;
        this.display = display;
        this.pilha = pilha;
        this.display = document.querySelector('.display-input');
        if (this.display) {
            return;
        }
        else {
            alert('Erro ao carregar a calculadora');
        }
    }
    setarValor(valor) {
        this.pilha.push(valor);
    }
    setarOperador(operador) {
        if (this.pilha.length > 0) {
            const ultimoItem = this.pilha[this.pilha.length - 1];
            if (typeof ultimoItem === 'string' && operadores.includes(ultimoItem)) {
                this.pilha[this.pilha.length - 1] = operador;
            }
            else {
                this.pilha.push(operador);
            }
        }
    }
    setarDisplay(valor) {
        if (this.display) {
            this.display.value = valor;
        }
    }
    adicionarAPilha(valor) {
        const ultimoItem = this.pilha[this.pilha.length - 1];
        if (typeof valor === 'string' && operadores.includes(valor)) {
            if (this.pilha.length === 0) {
                return;
            }
            this.setarOperador(valor);
        }
        else {
            if (typeof valor === 'string') {
                if (typeof ultimoItem === 'string' && !operadores.includes(ultimoItem)) {
                    if (ultimoItem.includes(',') && valor === ',') {
                        return;
                    }
                    this.pilha[this.pilha.length - 1] = `${ultimoItem}${valor}`;
                }
                else {
                    this.pilha.push(`${valor}`);
                }
            }
        }
        console.log(this.pilha);
        this.setarDisplay(this.pilha.join(' '));
    }
    calcular() {
        const memoriaTemporaria = [];
        let tempOperador = null;
        let tempOperando = null;
        this.pilha.forEach((elemento) => {
            if (typeof elemento === 'number' || (typeof elemento === 'string' && !operadores.includes(elemento))) {
                if (tempOperando === null) {
                    tempOperando = elemento;
                }
                else {
                    if (tempOperador) {
                        if (tempOperador === enumaradorDasOperacoes.MULTIPLICACAO) {
                            tempOperando = parseFloat(tempOperando.toString().replace(',', '.')) * parseFloat(elemento.toString().replace(',', '.'));
                        }
                        else if (tempOperador === enumaradorDasOperacoes.DIVISAO) {
                            if (parseFloat(elemento.toString().replace(',', '.')) === 0) {
                                this.pilha = [];
                                this.setarDisplay('Não é possível dividir por 0');
                                setTimeout(() => { this.setarDisplay(''); }, 2000);
                                return;
                            }
                            else {
                                tempOperando = parseFloat(tempOperando.toString().replace(',', '.')) / parseFloat(elemento.toString().replace(',', '.'));
                            }
                        }
                        else {
                            tempOperador = null;
                        }
                    }
                }
            }
            else if (operadoresPrioritarios.includes(elemento)) {
                tempOperador = elemento;
            }
            else if (operadoresNormais.includes(elemento)) {
                memoriaTemporaria.push(tempOperando);
                memoriaTemporaria.push(elemento);
                tempOperando = null;
            }
        });
        if (tempOperando !== null) {
            memoriaTemporaria.push(tempOperando);
        }
        if (this.pilha.length > 0) {
            let resultado = parseFloat(memoriaTemporaria[0].toString().replace(',', '.'));
            for (let i = 1; i < memoriaTemporaria.length; i += 2) {
                const operador = memoriaTemporaria[i];
                const operando = memoriaTemporaria[i + 1];
                if (operador === enumaradorDasOperacoes.ADICAO) {
                    resultado += parseFloat(operando.toString().replace(',', '.'));
                }
                else if (operador === enumaradorDasOperacoes.SUBTRACAO) {
                    resultado -= parseFloat(operando.toString().replace(',', '.'));
                }
            }
            if (isNaN(resultado)) {
                this.pilha = [];
                this.setarDisplay('Resultado inválido :(');
                setTimeout(() => { this.setarDisplay(''); }, 2000);
                return;
            }
            this.pilha = [];
            this.setarValor(resultado.toString().replace('.', ','));
            this.setarDisplay(resultado.toString().replace('.', ','));
            console.log(`RESULTADO: ${resultado}`.replace('.', ','));
            console.log(this.pilha);
            console.log(memoriaTemporaria);
        }
    }
    limpar() {
        this.pilha = [];
        this.display.value = '';
        console.clear();
    }
    mudarSinal() {
        if (this.pilha.length > 0) {
            const primeiroItem = this.pilha[0];
            if (typeof primeiroItem === 'number' || (typeof primeiroItem === 'string' && !operadores.includes(primeiroItem))) {
                if (typeof primeiroItem === 'number') {
                    this.pilha[0] = -primeiroItem;
                }
                else {
                    this.pilha[0] = -parseFloat(primeiroItem.toString().replace(',', '.'));
                }
                this.setarDisplay(this.pilha.join(' '));
            }
        }
    }
    apagarDigito() {
        if (this.pilha.length > 0) {
            const ultimoItem = this.pilha[this.pilha.length - 1];
            if (typeof ultimoItem === 'number') {
                const numeroComoString = ultimoItem.toString();
                if (numeroComoString.length > 1) {
                    const novoNumeroComoString = numeroComoString.slice(0, -1);
                    this.pilha[this.pilha.length - 1] = parseFloat(novoNumeroComoString);
                }
                else {
                    this.pilha.pop();
                }
            }
            else if (typeof ultimoItem === 'string' && ultimoItem.length > 1) {
                this.pilha[this.pilha.length - 1] = ultimoItem.slice(0, -1);
            }
            else {
                this.pilha.pop();
            }
            this.setarDisplay(this.pilha.join(' '));
        }
        console.log(this.pilha);
    }
}
const calculadora = new Calculadora([]);
const numeros = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '.'];
document.addEventListener("keydown", (evento) => {
    evento.preventDefault();
    if (evento.key === "Enter") {
        calculadora.calcular();
    }
    else if (evento.key === "Delete") {
        calculadora.limpar();
    }
    else if (numeros.includes(evento.key)) {
        calculadora.adicionarAPilha(evento.key);
    }
    else if (operadores.includes(evento.key)) {
        calculadora.adicionarAPilha(evento.key);
    }
    else if (evento.key === "Backspace") {
        calculadora.apagarDigito();
    }
    else if (evento.key === "Delete") {
        calculadora.limpar();
    }
});