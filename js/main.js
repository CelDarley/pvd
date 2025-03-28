// Variável global para o sistema de pedidos
let sistemaPedidos = null;

// Função para inicializar o sistema
function inicializarSistema() {
    // Elementos da interface
    const telaInicial = document.getElementById('inicial');
    const telaCardapio = document.getElementById('cardapio');
    const btnIrCardapio = document.getElementById('btn-ir-cardapio');

    // Verifica se os elementos necessários existem
    if (!telaInicial || !telaCardapio || !btnIrCardapio) {
        console.error('Elementos necessários não encontrados:', {
            telaInicial: !!telaInicial,
            telaCardapio: !!telaCardapio,
            btnIrCardapio: !!btnIrCardapio
        });
        return;
    }

    // Função para ir ao cardápio
    function irParaCardapio() {
        telaInicial.classList.remove('ativo');
        telaCardapio.classList.add('ativo');
        
        // Inicializa o sistema de pedidos apenas após a leitura do cartão
        if (!sistemaPedidos) {
            sistemaPedidos = new SistemaPedidos();
        }
    }

    // Evento do botão
    btnIrCardapio.addEventListener('click', irParaCardapio);

    // Simular leitura do cartão (pode ser substituído pela leitura real do cartão)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') { // Pressione Enter para simular a leitura do cartão
            irParaCardapio();
        }
    });
}

// Inicializar o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', inicializarSistema); 