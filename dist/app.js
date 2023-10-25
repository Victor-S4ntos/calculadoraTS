const enumOperacoes = {
    SOMA: '+',
    SUBTRACAO: '-',
    DIVISAO: '/',
    MULTIPLICACAO: 'x'
};
const operadores = ['+', '-', 'x', '/'];
class Calculadora {
    constructor(pilha, display) {
        this.pilha = pilha;
        this.display = display;
        this.pilha = pilha;
        this.display = document.querySelector('.display-input');
        if (this.display.value === '' && this.pilha.length === 0) {
            this.display.value = '0';
            this.pilha.push(0);
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
    }
    adicionarAPilha(valor) {
        const ultimoItem = this.pilha[this.pilha.length - 1];
        if (typeof valor === 'string' && operadores.includes(valor)) {
            if (typeof ultimoItem === 'string' && operadores.includes(ultimoItem)) {
                this.pilha[this.pilha.length - 1] = valor;
            }
            else {
                this.pilha.push(valor);
            }
        }
        else if (typeof valor === 'number' || typeof valor === 'string' && !operadores.includes(valor)) {
            if (typeof ultimoItem === 'number') {
                this.pilha[this.pilha.length - 1] = parseFloat(ultimoItem + valor.toString());
            }
            else {
                this.setarValor(Number(valor));
            }
        }
        const displayValue = this.pilha.join(' ');
        this.setarDisplay(displayValue);
        console.log(this.pilha);
    }
    limparPilha() {
        this.pilha = [];
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
    limparDisplay() {
        if (this.display) {
            this.display.value = '';
        }
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
                                this.limparPilha();
                                this.setarDisplay('Não é possivel dividir por 0');
                                setTimeout(() => { this.setarDisplay(''); }, 2000);
                                return;
                            }
                            tempOperando /= elemento;
                        }
                        tempOperador = null;
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
            this.limparPilha();
            this.setarDisplay('Não é possivel dividir por 0');
            setTimeout(() => { this.setarDisplay(''); }, 2000);
            return;
        }
        this.limparPilha();
        this.setarValor(resultado);
        this.setarDisplay(resultado.toString());
        console.log(`RESULTADO: ${resultado}`);
    }
    limpar() {
        this.limparPilha();
        this.limparDisplay();
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
const numeros = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ','];
document.addEventListener("keydown", function (event) {
    event.preventDefault();
    if (event.key === "Enter") {
        calculadora.calcular();
    }
    else if (event.key === "Delete") {
        calculadora.limpar();
    }
    else if (numeros.includes(event.key)) {
        calculadora.adicionarAPilha(event.key);
    }
    else if (operadores.includes(event.key)) {
        calculadora.adicionarAPilha(event.key);
    }
    else if (event.key === "Backspace") {
        calculadora.apagarDigito();
    }
    else if (event.key === "Delete") {
        calculadora.limpar();
    }
});
