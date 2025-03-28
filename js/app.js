class SistemaPedidos {
    constructor() {
        this.pedidoAtual = [];
        this.contaAtual = null;
        this.pedidosFeitos = [];
        this.produtos = [
            {
                id: 1,
                nome: "Pilsen 300ml",
                descricao: "Cerveja Pilsen 300ml",
                preco: 15.00,
                imagem: "🍺"
            },
            {
                id: 2,
                nome: "Pilsen 500ml",
                descricao: "Cerveja Pilsen 500ml",
                preco: 25.00,
                imagem: "🍺"
            },
            {
                id: 3,
                nome: "Session IPA 300ml",
                descricao: "Session IPA 300ml",
                preco: 18.00,
                imagem: "🍺"
            },
            {
                id: 4,
                nome: "Session IPA 500ml",
                descricao: "Session IPA 500ml",
                preco: 30.00,
                imagem: "🍺"
            },
            {
                id: 5,
                nome: "Larger 300ml",
                descricao: "Larger 300ml",
                preco: 16.00,
                imagem: "🍺"
            },
            {
                id: 6,
                nome: "Larger 500ml",
                descricao: "Larger 500ml",
                preco: 28.00,
                imagem: "🍺"
            }
        ];
        this.inicializar();
    }

    inicializar() {
        this.carregarProdutos();
        this.configurarEventos();
    }

    carregarProdutos() {
        // Função para gerar o HTML de um produto
        const gerarHTMLProduto = (produto) => `
            <div class="produto" data-id="${produto.id}" style="cursor: pointer;">
                <div class="produto-imagem">${produto.imagem}</div>
                <div class="info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="preco">R$ ${produto.preco.toFixed(2)}</div>
                </div>
            </div>
        `;

        // Carrega os produtos na seção de Chops
        document.getElementById('chops').innerHTML = this.produtos.map(gerarHTMLProduto).join('');
    }

    configurarEventos() {
        // Eventos do cardápio
        document.querySelectorAll('.produto').forEach(produto => {
            produto.addEventListener('click', (e) => {
                const id = parseInt(produto.dataset.id);
                this.adicionarItem(id);
            });
        });

        // Eventos de pagamento
        document.querySelectorAll('[data-pagamento]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const forma = e.currentTarget.dataset.pagamento;
                this.processarPagamento(forma);
            });
        });

        // Evento do botão voltar ao cardápio
        document.getElementById('btn-voltar-cardapio')?.addEventListener('click', () => {
            this.mostrarTela('cardapio');
        });

        // Evento do botão pagar conta
        document.getElementById('btn-pagar-conta')?.addEventListener('click', () => {
            this.mostrarTela('pagamento');
        });

        // Botão voltar na tela de pagamento
        document.getElementById('btn-voltar-pagamento')?.addEventListener('click', () => {
            this.mostrarTela('cardapio');
        });
    }

    adicionarItem(id) {
        const produto = this.produtos.find(p => p.id === id);
        if (!produto) return;

        this.pedidoAtual.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });

        this.atualizarListaPedido();
        this.mostrarTela('pagamento');
    }

    atualizarListaPedido() {
        const itensConta = document.getElementById('itens-conta-visualizacao');
        itensConta.innerHTML = '';

        this.pedidoAtual.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-conta';
            itemElement.innerHTML = `
                <div class="info-item">
                    <span class="nome-item">${item.nome}</span>
                    <span class="quantidade">x${item.quantidade}</span>
                </div>
                <div class="preco-item">R$ ${(item.preco * item.quantidade).toFixed(2)}</div>
            `;
            itensConta.appendChild(itemElement);
        });

        const total = this.calcularTotal();
        document.getElementById('valor-total-visualizacao').textContent = total.toFixed(2);
    }

    calcularTotal() {
        return this.pedidoAtual.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    mostrarTela(id) {
        document.querySelectorAll('.tela').forEach(tela => {
            tela.classList.remove('ativo');
        });
        document.getElementById(id).classList.add('ativo');

        // Se for a tela de pagamento, reseta o conteúdo
        if (id === 'pagamento') {
            const mainPagamento = document.querySelector('#pagamento main');
            mainPagamento.innerHTML = `
                <div class="grid-2">
                    <a href="#" class="bloco" data-pagamento="cartao">
                        <h2>Cartão</h2>
                    </a>
                    <a href="#" class="bloco" data-pagamento="pix">
                        <h2>PIX</h2>
                    </a>
                </div>
            `;

            // Adiciona os event listeners novamente
            document.querySelectorAll('[data-pagamento]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const forma = e.currentTarget.dataset.pagamento;
                    this.processarPagamento(forma);
                });
            });
        }
    }

    async processarPagamento(metodo) {
        if (metodo === 'pix') {
            this.mostrarTela('pix');
            const telaPagamento = document.getElementById('pix');
            const mainPagamento = telaPagamento.querySelector('main');
            
            // Mostra QR Code do PIX
            mainPagamento.innerHTML = `
                <div class="mensagem-pagamento">
                    <div class="icone-cartao">📱</div>
                    <h2>Aproxime seu celular</h2>
                    <div id="qrcode" class="bloco">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=chop123" alt="QR Code PIX">
                    </div>
                </div>
            `;

            // Aguarda 2 segundos
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mostra mensagem de sucesso
            mainPagamento.innerHTML = `
                <div class="mensagem-pagamento sucesso">
                    <div class="icone-cartao">💳</div>
                    <h2>Pagamento efetuado com sucesso!</h2>
                    <div class="detalhes-pagamento">
                        <div class="bandeira">PIX</div>
                        <div class="numero-cartao">Pagamento Instantâneo</div>
                        <div class="valor">R$ ${this.calcularTotal().toFixed(2)}</div>
                    </div>
                </div>
            `;

            // Aguarda 2 segundos e mostra a animação do copo
            await new Promise(resolve => setTimeout(resolve, 2000));
            mainPagamento.innerHTML = `
                <div class="animacao-copo">
                    <div class="icone-copo">🍺</div>
                    <div class="local-copo"></div>
                    <h2>Coloque seu copo no local indicado</h2>
                </div>
            `;

            // Aguarda 2 segundos e mostra a mensagem da torneira
            await new Promise(resolve => setTimeout(resolve, 2000));
            mainPagamento.innerHTML = `
                <div class="mensagem-torneira">
                    <div class="icone-torneira">🚰</div>
                    <h2>Compra gravada no copo</h2>
                    <p>Quando quiser, aproxime o copo que a torneira será liberada</p>
                </div>
            `;

            // Aguarda 4 segundos e volta para o cardápio
            await new Promise(resolve => setTimeout(resolve, 4000));
            this.limparPedido();
            this.mostrarTela('cardapio');
        } else if (metodo === 'cartao') {
            const telaPagamento = document.getElementById('pagamento');
            const mainPagamento = telaPagamento.querySelector('main');
            
            // Mostra mensagem de aproximar o cartão
            mainPagamento.innerHTML = `
                <div class="mensagem-pagamento">
                    <div class="icone-cartao">💳</div>
                    <h2>Aproxime seu cartão</h2>
                </div>
            `;

            // Aguarda 2 segundos
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Gera um número de cartão aleatório (apenas para demonstração)
            const numeroCartao = '**** **** **** ' + Math.floor(Math.random() * 9000 + 1000);
            const bandeira = 'Visa';

            // Mostra mensagem de sucesso
            mainPagamento.innerHTML = `
                <div class="mensagem-pagamento sucesso">
                    <div class="icone-cartao">💳</div>
                    <h2>Pagamento efetuado com sucesso!</h2>
                    <div class="detalhes-pagamento">
                        <div class="bandeira">${bandeira}</div>
                        <div class="numero-cartao">${numeroCartao}</div>
                        <div class="valor">R$ ${this.calcularTotal().toFixed(2)}</div>
                    </div>
                </div>
            `;

            // Aguarda 2 segundos e mostra a animação do copo
            await new Promise(resolve => setTimeout(resolve, 2000));
            mainPagamento.innerHTML = `
                <div class="animacao-copo">
                    <div class="icone-copo">🍺</div>
                    <div class="local-copo"></div>
                    <h2>Coloque seu copo no local indicado</h2>
                </div>
            `;

            // Aguarda 2 segundos e mostra a mensagem da torneira
            await new Promise(resolve => setTimeout(resolve, 2000));
            mainPagamento.innerHTML = `
                <div class="mensagem-torneira">
                    <div class="icone-torneira">🚰</div>
                    <h2>Compra gravada no copo</h2>
                    <p>Quando quiser, aproxime o copo que a torneira será liberada</p>
                </div>
            `;

            // Aguarda 4 segundos e volta para o cardápio
            await new Promise(resolve => setTimeout(resolve, 4000));
            this.limparPedido();
            this.mostrarTela('cardapio');
        }
    }

    limparPedido() {
        this.pedidoAtual = [];
        this.atualizarListaPedido();
    }
}

// Inicializa o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new SistemaPedidos();
}); 