const operadores = ['+', '-', 'x', '/'];


class Calculadora {
    constructor(protected pilha: Array<string | number>, public display?: HTMLInputElement) {
        this.pilha = pilha;
        this.display = document.querySelector('.display-input') as HTMLInputElement;
        if (this.display) {
            return
        } else {
            alert('Erro ao carregar a calculadora');
        }
    }

    setarOperador(operador: string): void {
        if (this.pilha.length > 0) {
            const ultimoItem = this.pilha[this.pilha.length - 1];
            if (typeof ultimoItem === 'string' && operadores.includes(ultimoItem)) {
                this.pilha[this.pilha.length - 1] = operador;
            } else {
                this.pilha.push(operador);
            }
        }
    }

    setarValor(valor: number): void {
        this.pilha.push(valor);
        console.log(valor)
    }

    adicionarAPilha(valor: string | number) {
        const ultimoItem = this.pilha[this.pilha.length - 1];

        if (typeof valor === 'string' && operadores.includes(valor)) {
            if (typeof ultimoItem === 'string' && operadores.includes(ultimoItem)) {
                this.pilha[this.pilha.length - 1] = valor.toString();
            } else {
                this.pilha.push(valor.toString());
            }
        } else if (typeof valor === 'number' || typeof valor === 'string' && !operadores.includes(valor)) {
            if (typeof ultimoItem === 'number') {
                this.pilha[this.pilha.length - 1] = parseFloat(ultimoItem + valor.toString());
                console.log(this.pilha[this.pilha.length - 1])
                console.log(valor)
            } else {
                this.setarValor(Number(valor.toString()));
            }
        }

        this.setarDisplay(this.pilha.join(' '));
        console.log(this.pilha);
    }
    
    
    setarDisplay(valor: string): void {
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

    getarPilha(): Array<string | number> {
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
                } else {
                    if (tempOperador) {
                        if (tempOperador === 'x') {
                            tempOperando *= elemento;
                        } else if (tempOperador === '/') {
                            if (elemento === 0) {
                                this.pilha = [];
                                this.setarDisplay('Não é possivel dividir por 0');
                                setTimeout(() => { this.setarDisplay('') }, 2000);
                                return;
                            } else {
                                tempOperando /= elemento;
                            }
                        } else {
                            tempOperador = null;
                        }
                    }
                }
            } else if (operadoresPrioritarios.includes(elemento)) {
                tempOperador = elemento;
            } else if (operadoresNormais.includes(elemento)) {
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
            } else if (operador === '-') {
                resultado -= operando;
            }
        }

        if (isNaN(resultado)) {
            this.pilha = [];

            this.setarDisplay('Resultado inválido :(');
            setTimeout(() => { this.setarDisplay('') }, 2000);
            return;
        }

        this.pilha = [];
        this.setarValor(resultado);
        this.setarDisplay(resultado.toString().replace('.', ','));
        console.log(`RESULTADO: ${resultado}`);
    }

    limpar() {
        this.pilha = [];
        this.display.value = ''
        console.clear()
    }

    mudarSinal() {
        if (this.pilha.length > 0) {
            const primeiroItem = this.pilha[0];

            if (typeof primeiroItem === 'number') {
                if (primeiroItem > 0) {
                    this.pilha[0] = -primeiroItem;
                } else if (primeiroItem < 0) {
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
document.addEventListener("keydown", (event) => {
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