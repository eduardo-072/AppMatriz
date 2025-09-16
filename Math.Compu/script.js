// Função para corrigir valores zero (como no Java)
function corrigirZero(valor) {
    return (valor === 0.0) ? 0.0 : valor;
}

// Gerar inputs da matriz
function gerarMatrizInputs() {
    const grid = document.getElementById('matrizGrid');
    grid.innerHTML = '';
    
    for (let l = 0; l < 3; l++) {
        for (let c = 0; c < 4; c++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.className = 'matriz-input';
            input.id = `input-${l}-${c}`;
            
            if (c === 3) {
                input.placeholder = `= ?`;
            } else {
                const vars = ['x', 'y', 'z'];
                input.placeholder = `${vars[c]}`;
            }
            
            grid.appendChild(input);
        }
    }
}

// Obter valores da matriz
function obterMatriz() {
    const matriz = Array.from({ length: 3 }, () => Array(4).fill(0));
    
    for (let l = 0; l < 3; l++) {
        for (let c = 0; c < 4; c++) {
            const input = document.getElementById(`input-${l}-${c}`);
            const valor = parseFloat(input.value) || 0;
            matriz[l][c] = valor;
        }
    }
    
    return matriz;
}

// Função principal de cálculo (adaptada do código Java)
function calcularSistema() {
    const matriz = obterMatriz();
    
    // Nomeando o primeiro pivô e número negativo
    const nr_negativo = matriz[1][0] * -1;
    const pivo = matriz[0][0];

    // Verificar se o pivô é zero
    if (pivo === 0) {
        alert('Erro: O primeiro elemento da matriz não pode ser zero!');
        return null;
    }

    // Calculando nova linha 2
    const L2_C1 = (pivo * nr_negativo) + (matriz[1][0] * pivo);
    const L2_C2 = (matriz[0][1] * nr_negativo) + (matriz[1][1] * pivo);
    const L2_C3 = (matriz[0][2] * nr_negativo) + (matriz[1][2] * pivo);
    const L2_C4 = (matriz[0][3] * nr_negativo) + (matriz[1][3] * pivo);

    // Novo número negativo para linha 3
    const nr_negativo2 = matriz[2][0] * -1;
    
    // Calculando nova linha 3
    const L3_C1 = (pivo * nr_negativo2) + (matriz[2][0] * pivo);
    const L3_C2 = (matriz[0][1] * nr_negativo2) + (matriz[2][1] * pivo);
    const L3_C3 = (matriz[0][2] * nr_negativo2) + (matriz[2][2] * pivo);
    const L3_C4 = (matriz[0][3] * nr_negativo2) + (matriz[2][3] * pivo);

    // Criando a segunda matriz
    const segundaMatriz = Array.from({ length: 3 }, () => Array(4).fill(0));
    
    segundaMatriz[0] = [...matriz[0]];
    segundaMatriz[1][0] = L2_C1;
    segundaMatriz[1][1] = L2_C2;
    segundaMatriz[1][2] = L2_C3;
    segundaMatriz[1][3] = L2_C4;
    
    segundaMatriz[2][0] = L3_C1;
    segundaMatriz[2][1] = L3_C2;
    segundaMatriz[2][2] = L3_C3;
    segundaMatriz[2][3] = L3_C4;

    // Novo pivô
    const pivo2 = segundaMatriz[1][1];
    
    if (pivo2 === 0) {
        alert('Erro: Sistema sem solução única ou pivô zero encontrado!');
        return null;
    }
    
    const nr_negativo3 = segundaMatriz[2][1] * -1;

    // Calculando nova linha 3
    const l3_c1 = (nr_negativo3 * segundaMatriz[1][0]) + (segundaMatriz[2][0] * pivo2);
    const l3_c2 = (nr_negativo3 * segundaMatriz[1][1]) + (segundaMatriz[2][1] * pivo2);
    const l3_c3 = (nr_negativo3 * segundaMatriz[1][2]) + (segundaMatriz[2][2] * pivo2);
    const l3_c4 = (nr_negativo3 * segundaMatriz[1][3]) + (segundaMatriz[2][3] * pivo2);

    // Verificar se l3_c3 é zero
    if (l3_c3 === 0) {
        alert('Erro: Sistema sem solução única!');
        return null;
    }

    // Calculando o Z
    const z = l3_c4 / l3_c3;

    // Calculando o Y
    const y = (segundaMatriz[1][3] - (segundaMatriz[1][2] * z)) / segundaMatriz[1][1];

    // Calculando o X        
    const x = (matriz[0][3] - (matriz[0][1] * y + matriz[0][2] * z)) / matriz[0][0];

    return {
        x: corrigirZero(x),
        y: corrigirZero(y),
        z: corrigirZero(z)
    };
}

// Exibir resultado
function exibirResultado(resultado) {
    document.getElementById('valorX').textContent = Number.isInteger(resultado.x) ? resultado.x : resultado.x.toFixed(4);
    document.getElementById('valorY').textContent = Number.isInteger(resultado.y) ? resultado.y : resultado.y.toFixed(4);
    document.getElementById('valorZ').textContent = Number.isInteger(resultado.z) ? resultado.z : resultado.z.toFixed(4);
    
    document.getElementById('resultadoContainer').classList.add('show');
}

// Limpar valores
function limparValores() {
    const inputs = document.querySelectorAll('.matriz-input');
    inputs.forEach(input => input.value = '');
    document.getElementById('resultadoContainer').classList.remove('show');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    gerarMatrizInputs();
    
    document.getElementById('calcularBtn').addEventListener('click', function() {
        const loading = document.getElementById('loading');
        const btn = this;
        
        btn.disabled = true;
        loading.classList.add('show');
        document.getElementById('resultadoContainer').classList.remove('show');
        
        setTimeout(() => {
            const resultado = calcularSistema();
            
            loading.classList.remove('show');
            btn.disabled = false;
            
            if (resultado) {
                exibirResultado(resultado);
            }
        }, 500);
    });
    
    document.getElementById('limparBtn').addEventListener('click', limparValores);
    
    // Enter para calcular
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('calcularBtn').click();
        }
    });
});