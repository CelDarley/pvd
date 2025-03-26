class SistemaPedidos {
    constructor() {
        this.gateway = new GatewayPagamento();
        this.pedidoAtual = [];
        this.contaAtual = null;
        this.inicializar();
    }

    inicializar() {
        this.carregarProdutos();
        this.configurarEventos();
        this.mostrarTela('cardapio');
    }

    carregarProdutos() {
        const container = document.getElementById('lista-produtos');
        container.innerHTML = produtos.map(produto => `
            <div class="produto" data-id="${produto.id}">
                <div class="produto-imagem">${produto.imagem}</div>
                <div class="info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="preco">R$ ${produto.preco.toFixed(2)}</div>
                </div>
            </div>
        `).join('');
    }

    configurarEventos() {
        // Eventos do cardápio
        document.getElementById('lista-produtos').addEventListener('click', (e) => {
            const produto = e.target.closest('.produto');
            if (produto) {
                const id = parseInt(produto.dataset.id);
                this.adicionarItem(id);
            }
        });

        // Eventos das opções
        document.querySelectorAll('[data-opcao]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const opcao = e.currentTarget.dataset.opcao;
                this.processarOpcao(opcao);
            });
        });

        // Eventos de pagamento
        document.querySelectorAll('[data-pagamento]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const metodo = e.currentTarget.dataset.pagamento;
                this.processarPagamento(metodo);
            });
        });

        // Evento de confirmação de pedido
        document.getElementById('confirmacao-pedido').addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                this.confirmarPedido();
            }
        });

        // Evento do botão de avançar na tela de celular
        document.getElementById('btn-avancar-celular').addEventListener('click', () => {
            this.confirmarCelular();
        });

        // Evento do botão pular celular
        document.getElementById('btn-pular-celular').addEventListener('click', () => {
            this.mostrarTela('leitor-tag');
            this.lerTagNFC();
        });

        // Evento do botão ver conta
        document.getElementById('btn-ver-conta').addEventListener('click', () => {
            this.mostrarTela('leitor-tag');
            this.lerTagNFCVerConta();
        });

        // Evento do botão pagar conta
        document.getElementById('btn-pagar-conta').addEventListener('click', () => {
            this.mostrarTela('pagamento');
        });

        // Evento do botão continuar pedindo
        document.getElementById('btn-continuar-pedindo').addEventListener('click', () => {
            this.mostrarTela('cardapio');
        });

        // Evento do botão pagar pedido
        document.getElementById('btn-pagar-pedido').addEventListener('click', () => {
            this.mostrarTela('pagamento');
        });

        // Evento do botão voltar ao cardápio
        document.getElementById('btn-voltar-cardapio').addEventListener('click', () => {
            this.mostrarTela('cardapio');
        });

        // Botão voltar na tela de pagamento
        document.getElementById('btn-voltar-pagamento').addEventListener('click', () => {
            this.mostrarTela('cardapio');
        });

        // Botão abrir conta no cardápio
        document.getElementById('btn-abrir-conta-cardapio').addEventListener('click', () => {
            this.mostrarTela('celular');
        });

        // Evento do botão acrescentar na conta
        document.getElementById('btn-acrescentar-conta').addEventListener('click', () => {
            this.mostrarTela('leitor-tag');
            this.lerTagNFCAdicionarConta();
        });

        // Evento do botão confirmar pagamento
        document.getElementById('btn-confirmar-pagamento').addEventListener('click', async () => {
            const receberContaCelular = document.getElementById('receber-conta-celular').checked;
            const valor = this.calcularTotal();
            const pagamento = await this.gateway.processarCartao(valor);
            
            if (receberContaCelular && this.contaAtual?.celular) {
                // Envia a conta para o celular
                await this.gateway.enviarContaCelular(this.contaAtual.celular, this.pedidoAtual);
            }
            
            this.mostrarFeedbackPagamento(pagamento);
        });

        // Evento do botão cancelar pagamento
        document.getElementById('btn-cancelar-pagamento').addEventListener('click', () => {
            this.mostrarTela('pagamento');
        });

        // Evento do botão confirmar pagamento PIX
        document.getElementById('btn-confirmar-pix').addEventListener('click', async () => {
            const receberContaCelular = document.getElementById('receber-conta-celular-pix').checked;
            
            if (receberContaCelular && this.contaAtual?.celular) {
                // Envia a conta para o celular
                await this.gateway.enviarContaCelular(this.contaAtual.celular, this.pedidoAtual);
            }
            
            this.mostrarFeedbackPagamento({ sucesso: true, mensagem: 'Pagamento realizado com sucesso!' });
        });

        // Evento do botão cancelar pagamento PIX
        document.getElementById('btn-cancelar-pix').addEventListener('click', () => {
            this.mostrarTela('pagamento');
        });
    }

    adicionarItem(id) {
        const produto = produtos.find(p => p.id === id);
        if (produto) {
            // Preenche as informações do produto na tela
            document.getElementById('imagem-produto-selecionado').innerHTML = produto.imagem;
            document.getElementById('nome-produto-selecionado').textContent = produto.nome;
            document.getElementById('descricao-produto-selecionado').textContent = produto.descricao;
            document.getElementById('preco-produto-selecionado').textContent = produto.preco.toFixed(2);

            // Adiciona o produto ao pedido
            this.pedidoAtual.push({
                ...produto,
                quantidade: 1,
                opcoes: [],
                acrescimos: {
                    embalagem: false,
                    catchup: false,
                    maionese: false,
                    molhoEspecial: false,
                    batataFrita: false
                }
            });

            this.mostrarTela('confirmacao-pedido');
            this.atualizarListaPedido();
        }
    }

    processarOpcao(opcao) {
        switch (opcao) {
            case 'abrir-conta':
                this.mostrarTela('celular');
                break;
            case 'pagar-agora':
                this.mostrarTela('confirmacao-pedido');
                this.atualizarListaPedido();
                break;
            case 'pedir-conta':
                this.mostrarTela('leitor-tag');
                this.lerTagNFC();
                break;
            case 'fechar-conta':
                this.mostrarTela('leitor-tag');
                this.lerTagNFC();
                break;
        }
    }

    async processarPagamento(metodo) {
        if (metodo === 'cartao') {
            this.mostrarTela('leitor-cartao');
            const resultado = await this.gateway.lerCartao();
            if (resultado.sucesso) {
                // Preenche os dados do cartão na tela de confirmação
                document.getElementById('bandeira-cartao').src = resultado.dados.bandeira;
                document.getElementById('numero-cartao').textContent = resultado.dados.numero;
                document.getElementById('titular-cartao').textContent = resultado.dados.titular;
                document.getElementById('valor-total-cartao').textContent = this.calcularTotal().toFixed(2);
                
                // Mostra a tela de confirmação
                this.mostrarTela('confirmacao-cartao');
            }
        } else if (metodo === 'pix') {
            this.mostrarTela('pix');
            const valor = this.calcularTotal();
            const qrcode = this.gateway.gerarQRCode(valor);
            document.getElementById('qrcode').innerHTML = `<img src="${qrcode}" alt="QR Code PIX">`;
            
            // Inicia a verificação do pagamento
            this.verificarPagamentoPIX();
        }
    }

    async verificarPagamentoPIX() {
        // Simula um delay de 3 segundos antes de confirmar o pagamento
        setTimeout(() => {
            // Simula um pagamento bem-sucedido
            const resultado = {
                sucesso: true,
                dados: {
                    titular: 'Cliente PIX',
                    valor: this.calcularTotal()
                }
            };

            // Preenche os dados do pagamento na tela de confirmação
            document.getElementById('titular-pix').textContent = resultado.dados.titular;
            document.getElementById('valor-total-pix').textContent = resultado.dados.valor.toFixed(2);
            
            // Mostra a tela de confirmação
            this.mostrarTela('confirmacao-pix');
        }, 3000);
    }

    mostrarFeedbackPagamento(resultado) {
        const feedback = document.createElement('div');
        feedback.className = `feedback ${resultado.sucesso ? 'sucesso' : 'erro'}`;
        feedback.textContent = resultado.mensagem;
        document.querySelector('.container').appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
            if (resultado.sucesso) {
                this.limparPedido();
                this.mostrarTela('cardapio');
            } else {
                this.mostrarTela('cardapio');
            }
        }, 3000);
    }

    async lerTagNFC() {
        const resultado = await this.gateway.lerTagNFC();
        if (resultado.sucesso) {
            if (!this.contaAtual) {
                // Se não tem conta, é um novo pedido
                this.contaAtual = { ...resultado.dados };
                const nomeCliente = this.contaAtual.nome ? this.contaAtual.nome : 'Cliente';
                this.mostrarFeedback(`A conta de ${nomeCliente} foi criada. Já pode usar seu cartão ou pulseira para pedidos`);
                this.mostrarTela('cardapio');
            } else {
                // Se já tem conta, é um pedido adicional
                this.mostrarFeedback("Conta identificada");
                this.mostrarTela('confirmacao-pedido');
                this.atualizarListaPedido();
            }
        }
    }

    async lerTagNFCAdicionarConta() {
        const resultado = await this.gateway.lerTagNFC();
        if (resultado.sucesso) {
            // Formata a descrição dos itens
            const descricaoItens = this.pedidoAtual.map(item => {
                let descricao = `${item.quantidade}x ${item.nome}`;
                const acrescimos = [];
                
                if (item.acrescimos.embalagem) acrescimos.push('Embalagem para levar');
                if (item.acrescimos.catchup) acrescimos.push('Catchup');
                if (item.acrescimos.maionese) acrescimos.push('Maionese');
                if (item.acrescimos.molhoEspecial) acrescimos.push('Molho Especial');
                if (item.acrescimos.batataFrita) acrescimos.push('Batata Frita');
                
                if (acrescimos.length > 0) {
                    descricao += ` (${acrescimos.join(', ')})`;
                }
                
                return descricao;
            }).join('; ');

            this.mostrarFeedback(`Acrescentado na conta os itens: ${descricaoItens}`);
            this.limparPedido();
            this.mostrarTela('cardapio');
        }
    }

    async lerTagNFCVerConta() {
        const resultado = await this.gateway.lerTagNFC();
        if (resultado.sucesso) {
            this.contaAtual = { ...resultado.dados };
            this.mostrarTela('visualizar-conta');
            this.atualizarVisualizacaoConta();
        }
    }

    atualizarListaPedido() {
        // Atualiza o total
        document.getElementById('valor-total-pedido').textContent = this.calcularTotal().toFixed(2);

        // Configura os eventos dos botões de quantidade
        const btnDiminuir = document.querySelector('.controles-quantidade .btn-quantidade[data-acao="diminuir"]');
        const btnAumentar = document.querySelector('.controles-quantidade .btn-quantidade[data-acao="aumentar"]');
        const inputQuantidade = document.querySelector('.controles-quantidade .input-quantidade');

        if (this.pedidoAtual.length > 0) {
            const item = this.pedidoAtual[this.pedidoAtual.length - 1];
            inputQuantidade.value = item.quantidade;

            btnDiminuir.onclick = () => {
                if (item.quantidade > 1) {
                    item.quantidade--;
                    inputQuantidade.value = item.quantidade;
                    this.atualizarListaPedido();
                }
            };

            btnAumentar.onclick = () => {
                item.quantidade++;
                inputQuantidade.value = item.quantidade;
                this.atualizarListaPedido();
            };

            inputQuantidade.onchange = () => {
                const quantidade = parseInt(inputQuantidade.value);
                if (quantidade > 0) {
                    item.quantidade = quantidade;
                    this.atualizarListaPedido();
                }
            };
        }

        // Configura os eventos das opções
        document.querySelectorAll('.opcao input[type="checkbox"]').forEach(checkbox => {
            checkbox.onchange = () => {
                const item = this.pedidoAtual[this.pedidoAtual.length - 1];
                switch(checkbox.value) {
                    case 'embalagem':
                        item.acrescimos.embalagem = checkbox.checked;
                        break;
                    case 'catchup':
                        item.acrescimos.catchup = checkbox.checked;
                        break;
                    case 'maionese':
                        item.acrescimos.maionese = checkbox.checked;
                        break;
                    case 'molho-especial':
                        item.acrescimos.molhoEspecial = checkbox.checked;
                        break;
                    case 'batata-frita':
                        item.acrescimos.batataFrita = checkbox.checked;
                        break;
                }
                this.atualizarListaPedido();
            };
        });
    }

    calcularTotal() {
        return this.pedidoAtual.reduce((total, item) => {
            let itemTotal = item.preco * item.quantidade;
            
            // Adiciona acréscimos
            if (item.acrescimos.embalagem) itemTotal += 2.00 * item.quantidade;
            if (item.acrescimos.catchup) itemTotal += 1.00 * item.quantidade;
            if (item.acrescimos.maionese) itemTotal += 1.00 * item.quantidade;
            if (item.acrescimos.molhoEspecial) itemTotal += 2.00 * item.quantidade;
            if (item.acrescimos.batataFrita) itemTotal += 15.90 * item.quantidade;
            
            return total + itemTotal;
        }, 0);
    }

    confirmarPedido() {
        if (this.contaAtual) {
            this.mostrarFeedback("Pedido feito");
            this.limparPedido();
            this.mostrarTela('cardapio');
        }
    }

    limparPedido() {
        this.pedidoAtual = [];
    }

    mostrarFeedback(mensagem) {
        const feedback = document.createElement('div');
        feedback.className = 'feedback sucesso';
        feedback.textContent = mensagem;
        document.querySelector('.container').appendChild(feedback);
        setTimeout(() => feedback.remove(), 3000);
    }

    mostrarTela(id) {
        document.querySelectorAll('.tela').forEach(tela => {
            tela.classList.remove('ativo');
        });
        document.getElementById(id).classList.add('ativo');
    }

    confirmarCelular() {
        const inputNome = document.querySelector('#nome-cadastro');
        const inputCelular = document.querySelector('#celular-cadastro');
        const nome = inputNome.value.trim();
        const celular = inputCelular.value;
        
        if (!celular || celular.match(/^[0-9]{2}[0-9]{5}[0-9]{4}$/)) {
            this.contaAtual = {
                nome: nome || null,
                celular: celular || null
            };
            this.mostrarTela('leitor-tag');
            this.lerTagNFC();
        } else {
            this.mostrarFeedback("Por favor, insira um número de celular válido ou clique em Pular");
        }
    }

    atualizarVisualizacaoConta() {
        const container = document.getElementById('itens-conta-visualizacao');
        const itensExemplo = [
            { nome: 'X-Burger', preco: 25.90, quantidade: 2 },
            { nome: 'X-Bacon', preco: 28.90, quantidade: 1 },
            { nome: 'Batata Frita', preco: 15.90, quantidade: 2 },
            { nome: 'Refrigerante', preco: 8.90, quantidade: 3 },
            { nome: 'Água Mineral', preco: 5.90, quantidade: 2 },
            { nome: 'Sorvete', preco: 12.90, quantidade: 1 }
        ];

        container.innerHTML = itensExemplo.map(item => `
            <div class="item-pedido">
                <div class="info-item">
                    <span>${item.nome}</span>
                    <span>R$ ${item.preco.toFixed(2)}</span>
                </div>
                <div class="quantidade">
                    <span>x${item.quantidade}</span>
                </div>
            </div>
        `).join('');

        const total = itensExemplo.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        document.getElementById('valor-total-visualizacao').textContent = total.toFixed(2);
    }
}

// Inicializa o sistema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.sistema = new SistemaPedidos();
}); 