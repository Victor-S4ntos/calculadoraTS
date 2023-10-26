const operadores = ['+', '-', 'x', '/'];
const operadoresPrioritarios = ['x', '/'];
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
            if (operadores.includes(ultimoItem)) {
                this.setarOperador(valor.toString());
            }
            else {
                this.pilha.push(valor.toString());
            }
        }
        else if (typeof valor === 'number') {
            if (typeof ultimoItem === 'number') {
                this.pilha[this.pilha.length - 1] = parseFloat(ultimoItem.toString() + valor.toString());
            }
            else {
                this.setarValor(valor);
            }
        }
        else if (typeof valor === 'string' && !operadores.includes(valor)) {
            const numeroComVirgula = parseFloat(valor.replace(',', '.'));
            if (!isNaN(numeroComVirgula)) {
                if (typeof ultimoItem === 'number') {
                    this.pilha[this.pilha.length - 1] = parseFloat(ultimoItem.toString() + numeroComVirgula.toString());
                }
                else {
                    this.setarValor(numeroComVirgula);
                }
            }
        }
        this.setarDisplay(this.pilha.join(' ').replace('.', ','));
        console.log(this.pilha);
    }
    calcular() {
        const memoriaTemporaria = [];
        const operadoresNormais = ['+', '-'];
        let tempOperador = null;
        let tempOperando = null;
        this.pilha.forEach((elemento) => {
            if (typeof elemento === 'number') {
                if (tempOperando === null) {
                    tempOperando = elemento;
                }
                else {
                    if (tempOperador) {
                        if (tempOperador === 'x') {
                            tempOperando *= elemento;
                        }
                        else if (tempOperador === '/') {
                            if (elemento === 0) {
                                this.pilha = [];
                                this.setarDisplay('Não é possível dividir por 0');
                                setTimeout(() => { this.setarDisplay(''); }, 2000);
                                return;
                            }
                            else {
                                tempOperando /= elemento;
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
            let resultado = memoriaTemporaria[0];
            for (let i = 1; i < memoriaTemporaria.length; i += 2) {
                const operador = memoriaTemporaria[i];
                const operando = memoriaTemporaria[i + 1];
                if (operador === '+') {
                    resultado += operando;
                }
                else if (operador === '-') {
                    resultado -= operando;
                }
            }
            if (isNaN(resultado)) {
                this.pilha = [];
                this.setarDisplay('Resultado inválido :(');
                setTimeout(() => { this.setarDisplay(''); }, 2000);
                return;
            }
            this.pilha = [];
            this.setarValor(resultado);
            this.setarDisplay(resultado.toString().replace('.', ','));
            console.log(`RESULTADO: ${resultado}`.replace('.', ','));
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
            if (typeof primeiroItem === 'number') {
                if (primeiroItem > 0) {
                    this.pilha[0] = -primeiroItem;
                }
                else if (primeiroItem < 0) {
                    this.pilha[0] = Math.abs(primeiroItem);
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
    }
}
const calculadora = new Calculadora([]);
const numeros = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ','];
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
