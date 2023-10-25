const operadores = ['+', '-', 'x', '/'];
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
    setarValor(valor) {
        this.pilha.push(valor);
        console.log(valor);
    }
    adicionarAPilha(valor) {
        const ultimoItem = this.pilha[this.pilha.length - 1];
        if (typeof valor === 'string' && !operadores.includes(valor)) {
            if (typeof ultimoItem === 'string') {
                this.pilha[this.pilha.length - 1] += valor.toString();
            }
            else {
                this.pilha.push(valor.toString());
            }
        }
        else if (operadores.includes(valor.toString())) {
            this.pilha.push(valor.toString());
        }
        else if (typeof valor === 'number') {
            this.pilha.push(Number(valor.toString()));
        }
        this.setarDisplay(this.pilha.join(' '));
        console.log(this.pilha);
    }
    setarDisplay(valor) {
        if (this.display) {
            this.display.value = valor;
        }
    }
    getarDisplay() {
        if (this.display) {
            return this.display.value;
        }
        return;
    }
    getarPilha() {
        return this.pilha;
    }
    calcular() {
        const memoriaTemporaria = [];
        const operadoresPrioritarios = ['x', '/'];
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
                                this.setarDisplay('Não é possivel dividir por 0');
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
        console.log(`RESULTADO: ${resultado}`);
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
        this.display.value = this.display.value.slice(0, -1);
        this.pilha.pop();
    }
}
const calculadora = new Calculadora([]);
