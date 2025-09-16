// Corrige valores muito próximos de zero
function corrigirZero(valor) {
    return (Math.abs(valor) < 1e-10) ? 0.0 : valor;
}

// Formata uma matriz para exibição no <pre>
function formatarMatriz(matriz) {
    return matriz.map(linha => {
        return '[ ' + linha.map((valor, i) => {
            const num = corrigirZero(valor);
            return (i === linha.length - 1 ? '| ' : '') + num.toFixed(2);
        }).join(' ') + ' ]';
    }).join('\n');
}

// Gera os inputs da matriz 3x4
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

// Lê os valores dos inputs da matriz
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

// Função principal de cálculo do sistema
function calcularSistema() {
    const matriz = obterMatriz();

    // Pivô inicial
    const pivo = matriz[0][0];
    if (pivo === 0) {
        alert('Erro: O primeiro elemento da matriz (pivô) não pode ser zero!');
        return null;
    }

    // Eliminação para criar a segunda matriz
    const nr_negativo = -matriz[1][0];
    const L2_C1 = pivo * nr_negativo + matriz[1][0] * pivo;
    const L2_C2 = matriz[0][1] * nr_negativo + matriz[1][1] * pivo;
    const L2_C3 = matriz[0][2] * nr_negativo + matriz[1][2] * pivo;
    const L2_C4 = matriz[0][3] * nr_negativo + matriz[1][3] * pivo;

    const nr_negativo2 = -matriz[2][0];
    const L3_C1 = pivo * nr_negativo2 + matriz[2][0] * pivo;
    const L3_C2 = matriz[0][1] * nr_negativo2 + matriz[2][1] * pivo;
    const L3_C3 = matriz[0][2] * nr_negativo2 + matriz[2][2] * pivo;
    const L3_C4 = matriz[0][3] * nr_negativo2 + matriz[2][3] * pivo;

    const segundaMatriz = [
        [...matriz[0]],
        [L2_C1, L2_C2, L2_C3, L2_C4],
        [L3_C1, L3_C2, L3_C3, L3_C4]
    ];

    // Novo pivô da linha 2
    const pivo2 = segundaMatriz[1][1];
    if (pivo2 === 0) {
        alert('Erro: O segundo pivô é zero. Sistema sem solução única.');
        return null;
    }

    const nr_negativo3 = -segundaMatriz[2][1];
    const l3_c1 = nr_negativo3 * segundaMatriz[1][0] + segundaMatriz[2][0] * pivo2;
    const l3_c2 = nr_negativo3 * segundaMatriz[1][1] + segundaMatriz[2][1] * pivo2;
    const l3_c3 = nr_negativo3 * segundaMatriz[1][2] + segundaMatriz[2][2] * pivo2;
    const l3_c4 = nr_negativo3 * segundaMatriz[1][3] + segundaMatriz[2][3] * pivo2;

    if (l3_c3 === 0) {
        alert('Erro: Pivô da linha 3 é zero. Sistema sem solução única.');
        return null;
    }

    const terceiraMatriz = [
        [...segundaMatriz[0]],
        [...segundaMatriz[1]],
        [l3_c1, l3_c2, l3_c3, l3_c4]
    ];

    // Cálculo das variáveis
    const z = l3_c4 / l3_c3;
    const y = (segundaMatriz[1][3] - segundaMatriz[1][2] * z) / segundaMatriz[1][1];
    const x = (matriz[0][3] - matriz[0][1] * y - matriz[0][2] * z) / matriz[0][0];

    return {
        x: corrigirZero(x),
        y: corrigirZero(y),
        z: corrigirZero(z),
        matrizInicial: matriz,
        segundaMatriz,
        terceiraMatriz
    };
}

// Exibe resultado e matrizes na interface
function exibirResultado(resultado) {
    document.getElementById('valorX').textContent = Number.isInteger(resultado.x) ? resultado.x : resultado.x.toFixed(4);
    document.getElementById('valorY').textContent = Number.isInteger(resultado.y) ? resultado.y : resultado.y.toFixed(4);
    document.getElementById('valorZ').textContent = Number.isInteger(resultado.z) ? resultado.z : resultado.z.toFixed(4);

    document.getElementById('matrizInicialDisplay').textContent = formatarMatriz(resultado.matrizInicial);
    document.getElementById('segundaMatrizDisplay').textContent = formatarMatriz(resultado.segundaMatriz);
    document.getElementById('terceiraMatrizDisplay').textContent = formatarMatriz(resultado.terceiraMatriz);

    document.getElementById('resultadoContainer').classList.add('show');
}

// Limpa os valores dos inputs e oculta o resultado
function limparValores() {
    const inputs = document.querySelectorAll('.matriz-input');
    inputs.forEach(input => input.value = '');
    
    document.getElementById('resultadoContainer').classList.remove('show');
    document.getElementById('matrizInicialDisplay').textContent = '';
    document.getElementById('segundaMatrizDisplay').textContent = '';
    document.getElementById('terceiraMatrizDisplay').textContent = '';
}

// Configurações de evento ao carregar
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

    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('calcularBtn').click();
        }
    });
});
